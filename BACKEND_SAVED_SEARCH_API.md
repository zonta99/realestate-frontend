# Backend API Requirements: Saved Property Searches

## Overview
This document defines the backend API contract needed to support the Saved Property Search feature. This feature allows users to create, save, and execute property searches using dynamic attribute-based filters.

## Data Models

### SavedSearch Entity
```java
@Entity
@Table(name = "saved_searches")
public class SavedSearch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String filtersJson; // JSON array of SearchFilter objects

    @Column(nullable = false)
    private LocalDateTime createdDate;

    @Column(nullable = false)
    private LocalDateTime updatedDate;
}
```

### SearchFilter DTO
```java
public class SearchFilter {
    private Long attributeId;
    private PropertyAttributeDataType dataType;

    // For NUMBER and DATE ranges
    private String minValue;
    private String maxValue;

    // For SINGLE_SELECT and MULTI_SELECT (array of option values)
    private List<String> selectedValues;

    // For TEXT contains search
    private String textValue;

    // For BOOLEAN
    private Boolean booleanValue;
}
```

### API DTOs
```java
// Request DTO for creating/updating saved searches
public class SavedSearchRequest {
    private String name;
    private String description;
    private List<SearchFilter> filters;
}

// Response DTO
public class SavedSearchResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String name;
    private String description;
    private List<SearchFilter> filters;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}

// Request DTO for executing a search
public class PropertySearchCriteriaRequest {
    private List<SearchFilter> filters;
    private Integer page = 0;
    private Integer size = 20;
    private String sort = "createdDate,desc";
}
```

## API Endpoints

### 1. Get All Saved Searches for Current User
```http
GET /api/saved-searches
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": 1,
    "userId": 123,
    "userName": "John Doe",
    "name": "Downtown Condos",
    "description": "2-3 bedroom condos in downtown area under 500k",
    "filters": [
      {
        "attributeId": 5,
        "dataType": "NUMBER",
        "minValue": "2",
        "maxValue": "3"
      },
      {
        "attributeId": 10,
        "dataType": "SINGLE_SELECT",
        "selectedValues": ["Condo", "Apartment"]
      }
    ],
    "createdDate": "2025-01-15T10:30:00",
    "updatedDate": "2025-01-15T10:30:00"
  }
]
```

### 2. Get Saved Search by ID
```http
GET /api/saved-searches/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": 1,
  "userId": 123,
  "userName": "John Doe",
  "name": "Downtown Condos",
  "description": "2-3 bedroom condos in downtown area under 500k",
  "filters": [...],
  "createdDate": "2025-01-15T10:30:00",
  "updatedDate": "2025-01-15T10:30:00"
}

Response: 404 Not Found
{
  "message": "Saved search not found"
}

Response: 403 Forbidden (if search belongs to another user)
{
  "message": "Access denied"
}
```

### 3. Create Saved Search
```http
POST /api/saved-searches
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Downtown Condos",
  "description": "2-3 bedroom condos in downtown area under 500k",
  "filters": [
    {
      "attributeId": 5,
      "dataType": "NUMBER",
      "minValue": "2",
      "maxValue": "3"
    },
    {
      "attributeId": 1,
      "dataType": "NUMBER",
      "minValue": "0",
      "maxValue": "500000"
    },
    {
      "attributeId": 10,
      "dataType": "SINGLE_SELECT",
      "selectedValues": ["Condo", "Apartment"]
    }
  ]
}

Response: 201 Created
{
  "message": "Saved search created successfully",
  "data": {
    "id": 1,
    "userId": 123,
    "userName": "John Doe",
    "name": "Downtown Condos",
    "description": "2-3 bedroom condos in downtown area under 500k",
    "filters": [...],
    "createdDate": "2025-01-15T10:30:00",
    "updatedDate": "2025-01-15T10:30:00"
  }
}

Response: 400 Bad Request
{
  "message": "Validation error: name is required"
}
```

### 4. Update Saved Search
```http
PUT /api/saved-searches/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Search Name",
  "description": "Updated description",
  "filters": [...]
}

Response: 200 OK
{
  "message": "Saved search updated successfully",
  "data": {
    "id": 1,
    "userId": 123,
    "userName": "John Doe",
    "name": "Updated Search Name",
    "description": "Updated description",
    "filters": [...],
    "createdDate": "2025-01-15T10:30:00",
    "updatedDate": "2025-01-16T14:20:00"
  }
}

Response: 404 Not Found
Response: 403 Forbidden (if trying to update another user's search)
```

### 5. Delete Saved Search
```http
DELETE /api/saved-searches/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Saved search deleted successfully"
}

Response: 404 Not Found
Response: 403 Forbidden (if trying to delete another user's search)
```

### 6. Execute Property Search by Criteria
```http
POST /api/properties/search/by-criteria
Authorization: Bearer {token}
Content-Type: application/json

{
  "filters": [
    {
      "attributeId": 5,
      "dataType": "NUMBER",
      "minValue": "2",
      "maxValue": "3"
    },
    {
      "attributeId": 1,
      "dataType": "NUMBER",
      "minValue": "0",
      "maxValue": "500000"
    },
    {
      "attributeId": 10,
      "dataType": "SINGLE_SELECT",
      "selectedValues": ["Condo", "Apartment"]
    },
    {
      "attributeId": 15,
      "dataType": "TEXT",
      "textValue": "pool"
    },
    {
      "attributeId": 20,
      "dataType": "BOOLEAN",
      "booleanValue": true
    },
    {
      "attributeId": 25,
      "dataType": "DATE",
      "minValue": "2015-01-01",
      "maxValue": "2025-12-31"
    }
  ],
  "page": 0,
  "size": 20,
  "sort": "price,asc"
}

Response: 200 OK
{
  "content": [
    {
      "id": 1,
      "title": "Beautiful Downtown Condo",
      "description": "2BR condo with pool access",
      "price": 450000,
      "agentId": 5,
      "agentName": "Jane Smith",
      "status": "ACTIVE",
      "createdDate": "2025-01-10T09:00:00",
      "updatedDate": "2025-01-10T09:00:00",
      "attributeValues": [...]
    }
  ],
  "pageable": {...},
  "totalPages": 5,
  "totalElements": 95,
  "last": false,
  "size": 20,
  "number": 0,
  "first": true,
  "numberOfElements": 20,
  "empty": false
}
```

## Search Filter Logic

### NUMBER Filters
- If only `minValue` is set: `attribute_value >= minValue`
- If only `maxValue` is set: `attribute_value <= maxValue`
- If both are set: `attribute_value BETWEEN minValue AND maxValue`

### DATE Filters
- Same logic as NUMBER filters
- Format: ISO 8601 date string (YYYY-MM-DD)

### SINGLE_SELECT Filters
- `selectedValues` contains multiple options: `attribute_value IN (selectedValues)` (OR logic)

### MULTI_SELECT Filters
- `selectedValues` contains multiple options: Check if property's multi-select value contains ANY of the selected values
- Property multi-select values are stored as JSON arrays: `["option1", "option2"]`

### TEXT Filters
- `textValue` is set: `attribute_value LIKE %textValue%` (case-insensitive)

### BOOLEAN Filters
- `booleanValue` is set: `attribute_value = booleanValue`

## Database Query Example (Pseudo-SQL)

```sql
-- For a search with multiple filters, combine with AND logic
SELECT DISTINCT p.*
FROM properties p
LEFT JOIN property_values pv ON p.id = pv.property_id
WHERE p.status = 'ACTIVE'
  AND (
    -- NUMBER filter: bedrooms between 2 and 3
    (pv.attribute_id = 5 AND CAST(pv.value AS INTEGER) BETWEEN 2 AND 3)
  )
  AND (
    -- NUMBER filter: price under 500000
    (pv.attribute_id = 1 AND CAST(pv.value AS INTEGER) <= 500000)
  )
  AND (
    -- SINGLE_SELECT filter: property type is Condo OR Apartment
    (pv.attribute_id = 10 AND pv.value IN ('Condo', 'Apartment'))
  )
  AND (
    -- TEXT filter: description contains 'pool'
    (pv.attribute_id = 15 AND LOWER(pv.value) LIKE '%pool%')
  )
  AND (
    -- BOOLEAN filter: has parking = true
    (pv.attribute_id = 20 AND pv.value = 'true')
  )
ORDER BY p.created_date DESC
LIMIT 20 OFFSET 0;
```

## Security & Validation

### Authorization
- All endpoints require authentication (JWT token)
- Users can only view/edit/delete their own saved searches
- Search execution is available to all authenticated users

### Validation Rules
1. **SavedSearch**:
   - `name`: Required, max 100 characters
   - `description`: Optional, max 500 characters
   - `filters`: Required, must contain at least 1 filter

2. **SearchFilter**:
   - `attributeId`: Required, must reference valid property attribute
   - `dataType`: Required, must match the attribute's data type
   - Filter value fields must match the data type:
     - NUMBER: `minValue` and/or `maxValue` must be valid numbers
     - DATE: `minValue` and/or `maxValue` must be valid dates (YYYY-MM-DD)
     - SINGLE_SELECT/MULTI_SELECT: `selectedValues` must contain valid option values
     - TEXT: `textValue` must be non-empty
     - BOOLEAN: `booleanValue` must be true or false

3. **PropertySearchCriteriaRequest**:
   - `filters`: Required, must contain at least 1 filter
   - `page`: Optional, default 0, must be >= 0
   - `size`: Optional, default 20, must be between 1 and 100
   - `sort`: Optional, default "createdDate,desc"

## Error Responses

All error responses follow the standard format:
```json
{
  "message": "Error description",
  "data": null
}
```

Common HTTP status codes:
- `400 Bad Request`: Validation errors, invalid input
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User doesn't have permission to access resource
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server error

## Implementation Notes

1. **Performance Optimization**:
   - Index `property_values.attribute_id` and `property_values.property_id`
   - Index `saved_searches.user_id`
   - Consider caching frequently used attribute definitions
   - Use database-specific optimizations for JSON array searching (MULTI_SELECT)

2. **Only Search Active Properties**:
   - By default, only search properties with `status = 'ACTIVE'`
   - Allow admins/brokers to search ALL statuses if needed

3. **Filter Combination**:
   - All filters are combined with AND logic (all conditions must match)
   - Within SINGLE_SELECT/MULTI_SELECT, options are combined with OR logic

4. **Empty Filters**:
   - If a filter has no value set (e.g., NUMBER with neither min nor max), ignore it
   - If all filters are empty, return validation error

5. **Attribute Validation**:
   - Verify that `attributeId` exists and has `isSearchable = true`
   - Return clear validation error if trying to search by non-searchable attribute

## Testing Requirements

### Unit Tests
- Test each filter type independently
- Test filter combinations (AND logic)
- Test edge cases (null values, empty strings, invalid dates)
- Test authorization (users can't access other users' searches)

### Integration Tests
- Test full search flow: create search → save → execute → get results
- Test pagination and sorting
- Test with large datasets (performance)
- Test with missing/invalid attribute values

### Test Data
Create test properties with various attribute combinations:
- Properties with all attribute types populated
- Properties with missing attributes (NULL values)
- Properties with edge case values (0, negative numbers, far future dates)
- Mix of ACTIVE, PENDING, SOLD, INACTIVE properties
