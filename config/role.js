export const roles = [
    {
        role: 'superadmin',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_user',
            'read_users',
            'update_user',
            'delete_user',
        ]
    },
    {
        role: 'admin',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_user',
            'read_users',
            'update_user',
        ]
    },
    {
        role: 'farmer',
        permissions: [
            'update_profile',
            'delete_profile',
            
        ]
    },
    {
        role: 'supplier',
        permissions: [
            'update_profile',
            'delete_profile',
        ]
    },
    {
        role: 'user',
        permissions: [
            'update_profile',
            'delete_profile',
        ]
    }
];