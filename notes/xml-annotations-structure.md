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

See also:
[cds-annotations-structure.md](cds-annotations-structure.md) ·
[cds-extended-annotate-syntax.md](cds-extended-annotate-syntax.md)
