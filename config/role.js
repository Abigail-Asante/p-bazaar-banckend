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
            'create_product',
            'update_product',
            'delete_product',
            'create_order',
            'read_order',
            'update_order',
            'delete_order'
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
            'create_product',
            'update_product',
            'delete_product',
            'create_order',
            'read_order',
            'update_order',
            'delete_order'
        ]
    },
    {
        role: 'farmer',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_product',
            'update_product',
            'delete_product',
            'create_order',
            'read_order',
            'update_order',
            'delete_order'

        ]
    },
    {
        role: 'supplier',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_product',
            'update_product',
            'delete_product',
            'create_order',
            'read_order',
            'update_order',
            'delete_order'
        ]
    },
    {
        role: 'user',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_order',
            'read_order',
            'update_order',
            'delete_order'
        ]
    }
];