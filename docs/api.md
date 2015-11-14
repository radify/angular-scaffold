# angular-scaffold API documentation


`scaffold`
==========

<span class="hint">service in module `ur` </span>

Description
-----------

Provider for angular-scaffold

     var s = scaffold("Dogs", {
      paginate: { size: 1, strategy: 'infinite' }
    });

Dependencies
------------

`angular`

`model`

Methods
-------

### $config()

Get the configuration for this angular-scaffold instance

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold--config-page">
<p>Configuration of this angular-scaffold instance</p>
</div></td>
</tr>
</tbody>
</table>

### $init()

Initialise this scaffold

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold--init-page">
<p>Returns this object, supporting method chaining</p>
</div></td>
</tr>
</tbody>
</table>

### create()

Creates a new object when the deferred promise is resolved

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-create-page">
<p>Deferred promise</p>
</div></td>
</tr>
</tbody>
</table>

#### Specs for ur.scaffold:create

- should return a deferred

- should hang the model instance from the deferred

- should create a new object when the deferred is resolved

- should not save if the save option is false

- should set the saving ui state

### delete(index)

Find `index` and delete it from the API, then remove it from the collection

##### Parameters

<table>
<colgroup>
<col width="33%" />
<col width="33%" />
<col width="33%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Param</th>
<th align="left">Type</th>
<th align="left">Details</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">index</td>
<td align="left"><a href="">number</a><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-delete-page">
<p>Either the index of the item in the collection to remove, or the object itself, which will be searched for in the collection</p>
</div></td>
</tr>
</tbody>
</table>

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-delete-page">
<p>Promise</p>
</div></td>
</tr>
</tbody>
</table>

#### Specs for ur.scaffold:delete

- should return a deferred

- should hang the model instance from the deferred

- should delete the object when the deferred is resolved

- should set the saving ui state

### edit(index)

Find `index` and set it up for editing.

Updates the object when the deferred promise is resolved

##### Parameters

<table>
<colgroup>
<col width="33%" />
<col width="33%" />
<col width="33%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Param</th>
<th align="left">Type</th>
<th align="left">Details</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">index</td>
<td align="left"><a href="">number</a><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-edit-page">
<p>Either the index of the item in the collection to edit, or the object itself, which will be searched for in the collection</p>
</div></td>
</tr>
</tbody>
</table>

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-edit-page">
<p>Deferred promise</p>
</div></td>
</tr>
</tbody>
</table>

#### Specs for ur.scaffold:edit

- should return a deferred

- should hang a copy of the model instance from the deferred

- should update the object when the deferred is resolved

- should not update if the save option is false

- should set the saving ui state

### model()

Returns the configuration for this angular-scaffold instance

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">string</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-model-page">
<p>The underlying model this object is configured with</p>
</div></td>
</tr>
</tbody>
</table>

### page(page)

Select a page

##### Parameters

<table>
<colgroup>
<col width="33%" />
<col width="33%" />
<col width="33%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Param</th>
<th align="left">Type</th>
<th align="left">Details</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">page</td>
<td align="left"><a href="">number</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-page-page">
<p>Page of results to show</p>
</div></td>
</tr>
</tbody>
</table>

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-page-page">
<p>Configuration of this angular-scaffold instance</p>
</div></td>
</tr>
</tbody>
</table>

### query(query, page)

Get the configuration for this angular-scaffold instance

##### Parameters

<table>
<colgroup>
<col width="33%" />
<col width="33%" />
<col width="33%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Param</th>
<th align="left">Type</th>
<th align="left">Details</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">query</td>
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-query-page">
<p>e.g. { name: 'name to search for' }</p>
</div></td>
</tr>
<tr class="even">
<td align="left">page
<div>
<em>(optional)</em>
</div></td>
<td align="left"><a href="">number</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-query-page">
<p>If supplied, used to determine which page of results to show</p>
</div></td>
</tr>
</tbody>
</table>

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-query-page">
<p>Configuration of this angular-scaffold instance</p>
</div></td>
</tr>
</tbody>
</table>

### refresh(options)

Go to the API and refresh

##### Parameters

<table>
<colgroup>
<col width="33%" />
<col width="33%" />
<col width="33%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Param</th>
<th align="left">Type</th>
<th align="left">Details</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">options
<div>
<em>(optional)</em>
</div></td>
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-refresh-page">
<p>Query options to pass to the underlying angular-model <code>all</code> query</p>
</div></td>
</tr>
</tbody>
</table>

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-refresh-page">
<p>Returns this object, supporting method chaining</p>
</div></td>
</tr>
</tbody>
</table>

### total()

How many results in total are in the scaffold (not just the current page)

##### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">number</a></td>
<td align="left"><div class="ur-scaffold-page ur-scaffold-total-page">
<p>Total results</p>
</div></td>
</tr>
</tbody>
</table>

Properties
----------

### $ui

User interface related convenience properties, so in your UI, you can show saving and loading states

### pages

the count of pages that the API reported to the scaffold


`scaffold`
==========

<span class="hint">function in module `ur` </span>

Description
-----------

Configure a scaffold

Usage
-----

```javascript
scaffold(name[, options]);
```

#### Parameters

<table>
<colgroup>
<col width="33%" />
<col width="33%" />
<col width="33%" />
</colgroup>
<thead>
<tr class="header">
<th align="left">Param</th>
<th align="left">Type</th>
<th align="left">Details</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left">name</td>
<td align="left"><a href="">string</a></td>
<td align="left"><div class="ur-scaffoldprovider-page ur-scaffoldprovider-scaffold-page">
<p>The name</p>
</div></td>
</tr>
<tr class="even">
<td align="left">options
<div>
<em>(optional)</em>
</div></td>
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffoldprovider-page ur-scaffoldprovider-scaffold-page">
<p>Configuration object</p>
</div></td>
</tr>
</tbody>
</table>

#### Returns

<table>
<colgroup>
<col width="50%" />
<col width="50%" />
</colgroup>
<tbody>
<tr class="odd">
<td align="left"><a href="">object</a></td>
<td align="left"><div class="ur-scaffoldprovider-page ur-scaffoldprovider-scaffold-page">
<p>Created scaffold object</p>
</div></td>
</tr>
</tbody>
</table>

Example
-------

var s = scaffold("Dogs", { paginate: true });


