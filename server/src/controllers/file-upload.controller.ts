// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject, uuid } from '@loopback/core';
import {
    param,
    post,
    Request,
    requestBody,
    Response,
    RestBindings,
} from '@loopback/rest';
import { FILE_UPLOAD_SERVICE } from '../keys';
import { FileUploadHandler } from '../types';
import fs from 'fs'
import { repository } from '@loopback/repository';
import { DataModelRepository } from '../repositories';
import { DataModel } from '../models';
const csv = require('fast-csv');
/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
    /**
     * Constructor
     * @param handler - Inject an express request handler to deal with the request
     */
    constructor(
        @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
        @repository(DataModelRepository)
        public dataModelRepository: DataModelRepository,
    ) { }

    @post('/files', {
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                        },
                    },
                },
                description: 'Files and fields',
            },
        },
    })
    async fileUpload(
        @requestBody.file()
        request: Request,
        @inject(RestBindings.Http.RESPONSE) response: Response,
    ): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            this.handler(request, response, (err: unknown) => {
                if (err) reject(err);
                else {
                    const files = FileUploadController.getFilesAndFields(request)
                    this.uploadCsv(files["files"][0]["path"], "items")
                    resolve(files);
                }
            });
        });
    }

    private uploadCsv(uriFile: string, key: string) {
        const dataModel: DataModel = new DataModel()
        let csvDataColl: any[] = [];
        fs.createReadStream(uriFile)
            .pipe(csv.parse({ headers: true }))
            .on('error', (error: any) => console.error(error))
            .on('data', (row: any) => {
                row.id = uuid()
                csvDataColl.push(row)
                console.log(row)
            })
            .on('end', async (rowCount: any) => {
                dataModel.data = csvDataColl
                dataModel.key = key
                await this.dataModelRepository.deleteAll()
                await this.dataModelRepository.create(dataModel)
                fs.unlinkSync(uriFile)
            });
    }

    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    private static getFilesAndFields(request: Request) {
        const uploadedFiles = request.files;
        const mapper = (f: globalThis.Express.Multer.File) => ({
            fieldname: f.fieldname,
            originalname: f.originalname,
            encoding: f.encoding,
            mimetype: f.mimetype,
            size: f.size,
            path: f.path
        });
        let files: any[] = [];
        if (Array.isArray(uploadedFiles)) {
            files = uploadedFiles.map(mapper);
        } else {
            for (const filename in uploadedFiles) {
                files.push(...uploadedFiles[filename].map(mapper));
            }
        }
        return { files, fields: request.body };
    }
}