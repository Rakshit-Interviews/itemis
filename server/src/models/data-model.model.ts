import { Entity, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class DataModel extends Entity {
    // Define well-known properties here

    // Indexer property to allow additional data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @property({
        type: 'string',
        id: true,
        generated: true
    })
    id?: string;

    @property({
        type: 'string'
    })
    key?: string;

    @property({
        type: 'object',
        required: false,
    })
    data: any;

    [prop: string]: any;

    constructor(data?: Partial<DataModel>) {
        super(data);
    }
}

export interface DataModelRelations {
    // describe navigational properties here
}

export type DataModelWithRelations = DataModel & DataModelRelations;
