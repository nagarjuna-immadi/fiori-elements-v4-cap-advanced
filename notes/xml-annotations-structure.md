# XML (EDMX) Annotation Structure

This is the OData v4 **XML / EDMX** representation of the same annotations
described in [cds-annotations-structure.md](cds-annotations-structure.md). CDS
annotations compile down to this XML form; you also write it by hand in a Fiori
Elements app's local annotation file (`webapp/annotations/annotation.xml`).

> Same model as the CDS note: the "blocks" below are a way to *think about*
> Fiori Elements UI annotations, not a hard rule of the format.

## File skeleton

Every annotation file is an `edmx:Edmx` document: vocabulary references at the
top, then a `Schema` whose `Annotations` elements carry the actual terms.

```xml
<edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
  <!-- vocabulary references -->
  <edmx:Reference Uri="https://sap.github.io/odata-vocabularies/vocabularies/UI.xml">
    <edmx:Include Namespace="com.sap.vocabularies.UI.v1" Alias="UI"/>
  </edmx:Reference>
  <edmx:Reference Uri="https://sap.github.io/odata-vocabularies/vocabularies/Common.xml">
    <edmx:Include Namespace="com.sap.vocabularies.Common.v1" Alias="Common"/>
  </edmx:Reference>
  <!-- reference to the service metadata being annotated -->
  <edmx:Reference Uri="/processor/$metadata">
    <edmx:Include Namespace="TravelService"/>
  </edmx:Reference>

  <edmx:DataServices>
    <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="local">
      <!-- all <Annotations Target="..."> go here -->
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
```

See the project's skeleton at
[annotation.xml](../app/customer/webapp/annotations/annotation.xml).

## How the blocks map to XML

The CDS scopes map to the `Target` attribute of an `<Annotations>` element:

| Conceptual block | CDS | XML `Target` |
| --- | --- | --- |
| Entity-level | `annotate Service.Entity` | `TravelService.Travel` (entity type) |
| Field block | `annotate Service.Entity { field }` | `TravelService.Travel/Description` (property path) |
| Actions block | `annotate Service.action` | `TravelService.acceptTravel(...)` (action import / bound overload) |

Key shape differences from CDS:

- One `<Annotations Target="...">` element per target; each holds one or more
  `<Annotation Term="...">` children.
- Records are `<Record>` with `<PropertyValue Property="...">`; collections are
  `<Collection>`; enums are `EnumMember="UI.…"`.
- Term names are fully qualified via the alias (`UI.LineItem`,
  `Common.Label`), matching the `edmx:Include` aliases.

## 1. Entity-level

```xml
<Annotations Target="TravelService.Travel">
  <Annotation Term="UI.HeaderInfo">
    <Record Type="UI.HeaderInfoType">
      <PropertyValue Property="TypeName"       String="Travel"/>
      <PropertyValue Property="TypeNamePlural" String="Travels"/>
      <PropertyValue Property="Title">
        <Record Type="UI.DataField">
          <PropertyValue Property="Value" Path="Description"/>
        </Record>
      </PropertyValue>
    </Record>
  </Annotation>

  <Annotation Term="UI.LineItem">
    <Collection>
      <Record Type="UI.DataField">
        <PropertyValue Property="Value" Path="TravelID"/>
      </Record>
      <Record Type="UI.DataFieldForAction">
        <PropertyValue Property="Action" String="TravelService.acceptTravel"/>
        <PropertyValue Property="Label"  String="Accept Travel"/>
      </Record>
    </Collection>
  </Annotation>

  <Annotation Term="UI.SelectionFields">
    <Collection>
      <PropertyPath>to_Agency_AgencyID</PropertyPath>
      <PropertyPath>BeginDate</PropertyPath>
    </Collection>
  </Annotation>
</Annotations>
```

## 2. Field block

The `Target` is the **property path** `Entity/Property`.

```xml
<Annotations Target="TravelService.Travel/Description">
  <Annotation Term="Common.Label" String="Description"/>
</Annotations>

<Annotations Target="TravelService.Travel/TotalPrice">
  <Annotation Term="Measures.ISOCurrency" Path="CurrencyCode_code"/>
</Annotations>

<Annotations Target="TravelService.Travel/TravelID">
  <Annotation Term="Core.Computed" Bool="true"/>
</Annotations>
```

## 3. Actions block

The `Target` is the action (with its binding-parameter overload signature for
bound actions).

```xml
<Annotations Target="TravelService.acceptTravel(TravelService.Travel)">
  <Annotation Term="Core.OperationAvailable">
    <Ne>
      <Path>in/TravelStatus_code</Path>
      <String>A</String>
    </Ne>
  </Annotation>
  <Annotation Term="Common.SideEffects.TargetProperties">
    <Collection>
      <String>in/TravelStatus_code</String>
    </Collection>
  </Annotation>
</Annotations>
```

## CDS vs XML — when you see which

- **CDS (`.cds`)** — what you author in this CAP project; concise, merges across
  files. The source of truth here.
- **XML (`annotation.xml`)** — the compiled OData form, and the format used when
  annotating an *external* service in a standalone Fiori Elements app (no CAP
  model to edit). Verbose but explicit; useful for understanding `$metadata`.

## Using both layers in a CAP project

XML annotations are fully allowed in a CAP project — they live in the Fiori
Elements **app**, not the service model, and both layers coexist:

1. **CDS annotations (server side)** — the `.cds` files in `app/travel_processor/`
   and `srv/`. CAP compiles them into the service's `$metadata`. This is the
   primary, recommended way to annotate in CAP.
2. **XML annotations (app side)** — an app-local `annotation.xml`, wired into the
   app's `manifest.json` as an `ODataAnnotation` data source. UI5 **merges** it
   on top of the service metadata at runtime.

The customer app already has this plumbing:

```jsonc
// app/customer/webapp/manifest.json
"mainService": {
  "uri": "/processor/",
  "settings": { "annotations": ["annotation"], ... }   // <- references it
},
"annotation": {
  "type": "ODataAnnotation",
  "uri": "annotations/annotation.xml",
  "settings": { "localUri": "annotations/annotation.xml" }
}
```

See [manifest.json:23](../app/customer/webapp/manifest.json#L23) and
[manifest.json:30](../app/customer/webapp/manifest.json#L30).

**When to use the app-local XML layer** instead of editing CDS:

- app-specific UI tweaks you don't want in the shared service model, or
- annotating an *external* service you don't own (no CDS to edit).

**Caution:** when the same term targets the same element in both layers, the
merge can make it non-obvious which value wins. Keep each annotation in exactly
one layer to avoid surprises.

> In this project [annotation.xml](../app/customer/webapp/annotations/annotation.xml)
> is currently just an empty skeleton (references only, no `<Annotations>`), so
> the customer app runs purely on the CDS annotations — the plumbing is in place
> but nothing is layered on top yet.

## CAP project vs. standalone Fiori app

Which annotation formats you can *author* depends on whether you own a backend
model:

| | CAP project | Standalone Fiori Elements app (no CAP) |
| --- | --- | --- |
| **CDS** (`.cds`) | ✅ author in the service model | ❌ no model to annotate |
| **XML** (`annotation.xml`) | ✅ optional, app-side layer | ✅ the only format you author |

**Key idea — everything is XML at the OData wire level.** CDS is just a nicer
*source language* that compiles to EDMX XML; it's only available when you own a
CAP (or ABAP) model. In a standalone app you don't author CDS — you author XML,
and you consume whatever the backend already emitted.

A standalone app typically gets annotations from **two XML sources**:

1. **Backend `$metadata`** — annotations baked into the service. These may have
   originated from *ABAP CDS* (S/4HANA) or any backend, but by the time the app
   sees them they're just OData annotations in `$metadata`.
2. **Local `annotation.xml`** — what you add in the app, layered on top.

> So "in a pure Fiori app only XML is possible" is right for what *you author in
> the app*. CDS annotation authoring is a CAP/ABAP **backend** capability, not a
> frontend one.

See also:
[cds-annotations-structure.md](cds-annotations-structure.md) ·
[cds-extended-annotate-syntax.md](cds-extended-annotate-syntax.md)
