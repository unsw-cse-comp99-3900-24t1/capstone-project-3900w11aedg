const claimsSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        submission_requirements: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    rule: { type: 'string' },
                    count: { type: 'number' },
                    from: { type: 'string' }
                },
                required: ['name', 'rule', 'count', 'from']
            }
        },
        input_descriptors: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    group: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    format: {
                        type: 'object',
                        properties: {
                            ldp_vc: {
                                type: 'object',
                                properties: {
                                    proof_type: {
                                        type: 'array',
                                        items: { type: 'string' }
                                    }
                                },
                                required: ['proof_type']
                            },
                        },
                        required: ['ldp_vc']
                    },
                    constraints: {
                        type: 'object',
                        properties: {
                            fields: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        path: {
                                            type: 'array',
                                            items: { type: 'string' }
                                        },
                                        filter: {
                                            type: 'object',
                                            properties: {
                                                type: { type: 'string' },
                                                pattern: { type: 'string' }
                                            },
                                            required: ['type', 'pattern']
                                        }
                                    },
                                    required: ['path']
                                }
                            }
                        }
                    }
                },
                required: ['id', 'format', 'constraints']
            }
        }
    },
    required: ['id', 'input_descriptors']
};
export default claimsSchema;
