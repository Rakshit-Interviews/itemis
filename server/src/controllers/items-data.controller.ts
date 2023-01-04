import {
    Count,
    CountSchema,
    Filter,
    FilterExcludingWhere,
    repository,
    Where,
} from '@loopback/repository';
import {
    post,
    param,
    get,
    getModelSchemaRef,
    patch,
    put,
    del,
    requestBody,
    response,
} from '@loopback/rest';
import { DataModel } from '../models';
import { DataModelRepository } from '../repositories';

export class ItemsDataController {
    constructor(
        @repository(DataModelRepository)
        public dataModelRepository: DataModelRepository,
    ) { }

    @get('/items/count')
    @response(200, {
        description: 'DataModel model count',
        content: { 'application/json': { schema: CountSchema } },
    })
    async count(
        @param.where(DataModel) where?: Where<DataModel>,
    ): Promise<Count> {
        return this.dataModelRepository.count(where);
    }

    @get('/items')
    @response(200, {
        description: 'Array of DataModel model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: getModelSchemaRef(DataModel, { includeRelations: true }),
                },
            },
        },
    })
    async find(
        @param.filter(DataModel) filter?: Filter<DataModel>,
    ): Promise<DataModel[]> {
        return this.dataModelRepository.find(filter);
    }

    @patch('/data-models')
    @response(200, {
        description: 'DataModel PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
    })
    async updateAll(
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(DataModel, { partial: true }),
                },
            },
        })
        dataModel: DataModel,
        @param.where(DataModel) where?: Where<DataModel>,
    ): Promise<Count> {
        return this.dataModelRepository.updateAll(dataModel, where);
    }

}
