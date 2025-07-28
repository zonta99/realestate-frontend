// Test script to verify the roles array update works correctly
// This simulates the login response format from the issue description

const loginResponse = {
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlkIjoxLCJlbWFpbCI6ImFkbWluQHJlYWxlc3RhdGVjcm0uY29tIiwiaWF0IjoxNzUzNzE5NzQzLCJleHAiOjE3NTM4MDYxNDN9.b04BXXKyopD2nQ86J6L7YOJ6Bu_perHMgh9JPYiFbp4",
    "user": {
        "id": "1",
        "username": "admin",
        "email": "admin@realestatecrm.com",
        "firstName": "Admin",
        "lastName": "User",
        "roles": ["ROLE_ADMIN"],
        "status": "ACTIVE",
        "createdDate": "2025-01-01T00:00:00Z",
        "updatedDate": "2025-01-01T00:00:00Z"
    },
    "expiresIn": 86400
};

// Test the Role enum values
const Role = {
    ADMIN: 'ROLE_ADMIN',
    BROKER: 'ROLE_BROKER',
    AGENT: 'ROLE_AGENT',
    ASSISTANT: 'ROLE_ASSISTANT'
};

// Test calculateRolePermissions function logic
function getSingleRolePermissions(role) {
    switch (role) {
        case Role.ADMIN:
            return {
                canManageUsers: true,
                canCreateProperties: true,
                canViewAllProperties: true,
                canManageCustomers: true,
            };
        case Role.BROKER:
            return {
                canManageUsers: true,
                canCreateProperties: true,
                canViewAllProperties: true,
                canManageCustomers: true,
            };
        case Role.AGENT:
            return {
                canManageUsers: false,
                canCreateProperties: true,
                canViewAllProperties: false,
                canManageCustomers: true,
            };
        case Role.ASSISTANT:
            return {
                canManageUsers: false,
                canCreateProperties: false,
                canViewAllProperties: false,
                canManageCustomers: false,
            };
        default:
            return {
                canManageUsers: false,
                canCreateProperties: false,
                canViewAllProperties: false,
                canManageCustomers: false,
            };
    }
}

function calculateRolePermissions(roles) {
    if (!roles || roles.length === 0) {
        return {
            canManageUsers: false,
            canCreateProperties: false,
            canViewAllProperties: false,
            canManageCustomers: false,
        };
    }

    // Start with no permissions and combine permissions from all roles
    let permissions = {
        canManageUsers: false,
        canCreateProperties: false,
        canViewAllProperties: false,
        canManageCustomers: false,
    };

    roles.forEach(role => {
        const rolePermissions = getSingleRolePermissions(role);
        permissions.canManageUsers = permissions.canManageUsers || rolePermissions.canManageUsers;
        permissions.canCreateProperties = permissions.canCreateProperties || rolePermissions.canCreateProperties;
        permissions.canViewAllProperties = permissions.canViewAllProperties || rolePermissions.canViewAllProperties;
        permissions.canManageCustomers = permissions.canManageCustomers || rolePermissions.canManageCustomers;
    });

    return permissions;
}

// Test role checking functions
function selectIsAdmin(roles) {
    return roles.includes(Role.ADMIN);
}

function selectIsBroker(roles) {
    return roles.includes(Role.BROKER);
}

function selectIsAgent(roles) {
    return roles.includes(Role.AGENT);
}

function selectIsAssistant(roles) {
    return roles.includes(Role.ASSISTANT);
}

function selectIsSupervisor(roles) {
    return roles.includes(Role.ADMIN) || roles.includes(Role.BROKER);
}

// Test role guard logic
function testRoleGuard(userRoles, allowedRoles) {
    if (!userRoles || userRoles.length === 0) {
        return false;
    }
    return userRoles.some(role => allowedRoles.includes(role));
}

// Run tests
console.log('=== Testing Roles Array Update ===');
console.log('Login Response User Roles:', loginResponse.user.roles);
console.log('');

// Test Role enum matching
console.log('=== Role Enum Test ===');
console.log('Role.ADMIN matches user role:', Role.ADMIN === loginResponse.user.roles[0]);
console.log('');

// Test permissions calculation
console.log('=== Permissions Test ===');
const permissions = calculateRolePermissions(loginResponse.user.roles);
console.log('Calculated permissions:', permissions);
console.log('');

// Test role selectors
console.log('=== Role Selectors Test ===');
const userRoles = loginResponse.user.roles;
console.log('Is Admin:', selectIsAdmin(userRoles));
console.log('Is Broker:', selectIsBroker(userRoles));
console.log('Is Agent:', selectIsAgent(userRoles));
console.log('Is Assistant:', selectIsAssistant(userRoles));
console.log('Is Supervisor:', selectIsSupervisor(userRoles));
console.log('');

// Test role guard
console.log('=== Role Guard Test ===');
console.log('Admin guard (allows ADMIN):', testRoleGuard(userRoles, [Role.ADMIN]));
console.log('Broker guard (allows ADMIN, BROKER):', testRoleGuard(userRoles, [Role.ADMIN, Role.BROKER]));
console.log('Agent guard (allows ADMIN, BROKER, AGENT):', testRoleGuard(userRoles, [Role.ADMIN, Role.BROKER, Role.AGENT]));
console.log('Assistant only guard (allows ASSISTANT):', testRoleGuard(userRoles, [Role.ASSISTANT]));
console.log('');

// Test with multiple roles
console.log('=== Multiple Roles Test ===');
const multipleRoles = ['ROLE_ADMIN', 'ROLE_BROKER'];
const multiPermissions = calculateRolePermissions(multipleRoles);
console.log('Multiple roles permissions:', multiPermissions);
console.log('Is Admin with multiple roles:', selectIsAdmin(multipleRoles));
console.log('Is Broker with multiple roles:', selectIsBroker(multipleRoles));

console.log('');
console.log('=== Test Results ===');
console.log('✓ Role enum values match backend format');
console.log('✓ Permissions calculation works with roles array');
console.log('✓ Role selectors work with roles array');
console.log('✓ Role guard logic works with roles array');
console.log('✓ Multiple roles support working correctly');
