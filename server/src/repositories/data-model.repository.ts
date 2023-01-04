import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {DataModel, DataModelRelations} from '../models';

export class DataModelRepository extends DefaultCrudRepository<
  DataModel,
  typeof DataModel.prototype.id,
  DataModelRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(DataModel, dataSource);
  }
}
