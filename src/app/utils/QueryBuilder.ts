
import { IQueryConfig, IQueryParams, IQueryResult, PrismaCountArgs, PrismaFindManyArgs, PrismaModelDelegate, PrismaNumberFilter, PrismaStringFilter, PrismaWhereConditions } from "../interfaces/query.interface"

export class QueryBuilder<
    T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>

    >{
    private query: PrismaFindManyArgs;
    private countQuery: PrismaCountArgs;
    private page: number = 1;
    private limit: number = 10;
    private skip: number = 0;
    private sortBy: string = 'createdAt';
    private sortOrder: 'asc' | 'desc' = 'desc';
    private selectFields: Record<string, boolean> | undefined;

    constructor(
        private model: PrismaModelDelegate,
            private queryParams: IQueryParams,
        private config: IQueryConfig = {}
    ) {
        this.query = {
            where: {},
            include: {},
            orderBy: {},
            take: 10
        };
        this.countQuery = {
            where: {}
        };
    }

    search(): this {
        const { searchTerm } = this.queryParams;
        const { searchableFields } = this.config;

        if (!searchTerm || !searchableFields?.length) {
            return this;
        }

        const stringFilter: PrismaStringFilter = {
            contains: searchTerm,
            mode: 'insensitive'
        };

        const searchConditions: Record<string, unknown>[] = searchableFields.reduce<Record<string, unknown>[]>((conditions, field) => {
            if (!field) {
                return conditions;
            }

            const parts = field.split('.');

            if (parts.length === 1) {
                conditions.push({ [field]: stringFilter });
                return conditions;
            }

            if (parts.length === 2) {
                const [relation, nestedField] = parts as [string, string];
                conditions.push({ [relation]: { [nestedField]: stringFilter } });
                return conditions;
            }

            if (parts.length === 3) {
                const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                conditions.push({
                    [relation]: {
                        some: {
                            [nestedRelation]: {
                                [nestedField]: stringFilter
                            }
                        }
                    }
                });
                return conditions;
            }

            return conditions;
        }, []);

        const whereConditions = this.query.where as PrismaWhereConditions

        whereConditions.OR = searchConditions;
        const countWhereConditions = this.countQuery.where as PrismaWhereConditions;
        countWhereConditions.OR = searchConditions

        // if (searchConditions.length > 0) {
        //     const currentWhere = this.query.where as Record<string, unknown>;
        //     const currentCountWhere = this.countQuery.where as Record<string, unknown>;

        //     this.query.where = {
        //         ...currentWhere,
        //         OR: searchConditions
        //     };
        //     this.countQuery.where = {
        //         ...currentCountWhere,
        //         OR: searchConditions
        //     };
        // }

        return this;
    }

    filter(): this{

        const { filterableFields } = this.config;

        const excludeField = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields', 'include'];

        const filterParams: Record<string, unknown> = {};
        
        Object.keys(this.queryParams).forEach(key => {
            if (!excludeField.includes(key)) {
                filterParams[key] = this.queryParams[key];
            }
        })

        const queryWhere = this.query.where as Record<string, unknown>;
        const countQueryWhere = this.countQuery.where as Record<string, unknown>;

        Object.keys(filterParams).forEach(key => { 
            const value = filterParams[key];

            if (value === undefined || value === "") {
                return;
            }

            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
            

            if (key.includes(".")) {
                const parts = key.split(".");

                if (filterableFields && !filterableFields.includes(key)) {
                    return;
                }



                if (parts.length === 2) {
                    const [relation, nestedField] = parts as [string, string];

                    if (!queryWhere[relation]) {
                        queryWhere[relation] = {};
                        countQueryWhere[relation] = {};
                    }

                    
                    const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    queryRelation[nestedField] = this.parseFilterValue(value);
                    countRelation[nestedField] = this.parseFilterValue(value);
                  



                    return;
                }
                // else if (parts.length === 3) {
                //     const [relation, nestedRelation, nestedField] = parts as [string, string, string];

                //     if (!queryWhere[relation]) {
                //         queryWhere[relation] = {};
                //         countQueryWhere[relation] = {};
                //     }
                //     const queryRelation = queryWhere[relation] as Record<string, unknown>;
                //     const countRelation = countQueryWhere[relation] as Record<string, unknown>;
                   
                //     if (!queryRelation[nestedRelation]) {
                //         queryRelation[nestedRelation] = {}
                //     }
                //     if (!countRelation[nestedRelation]) {
                //         countRelation[nestedRelation] = {}
                //     }

                //      const queryNestedRelation = queryWhere[nestedRelation] as Record<string, unknown>;
                //     const countNestedRelation = countQueryWhere[nestedRelation] as Record<string, unknown>;
                //     queryNestedRelation[nestedField] = this.parseFilterValue(value)
                //     countNestedRelation[nestedField] = this.parseFilterValue(value)
                //     return;
                // } 

                
            }

            
            if (!isAllowedField) {
                return;
            }
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                queryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                countQueryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>)
                return;
            }
            
            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);

        })


        return this
    }

    paginate(): this{

        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;

        this.page = page;
        this.limit = limit;
        this.skip = (page - 1) * limit;

        this.query.skip = this.skip;
        this.query.take = this.limit;


        return this;
    }

    sort(): this{

        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 'asc' : 'desc';
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;

        if (sortBy.includes(".")) {
            const parts = sortBy.split(".");

            if (parts.length === 2) {
                const [relation, nestedField] = parts as [string, string];

                this.query.orderBy = {
                    [relation]: {
                        [nestedField] : sortOrder
                    }
                }
            } else if (parts.length === 3) {
                const [relation, nestedRelation, nestedField] = parts as [string, string, string];
                this.query.orderBy = {
                    [relation]: {
                        [nestedRelation]: {
                            [nestedField]: sortOrder
                        }
                    }
                }
            } else {
                this.query.orderBy = {
                    [sortBy] : sortOrder
                }
            }
        } else {
             this.query.orderBy = {
                    [sortBy] : sortOrder
                }
        }

        return this;
    }

    fields(): this{
        // no nesting fields 
        const fieldsParam = this.queryParams.fields;

        if (fieldsParam && typeof fieldsParam === 'string') {
                     const fieldsArray = fieldsParam?.split(",").map(field => field.trim());

                this.selectFields = {};
                fieldsArray?.forEach(field => {
                    if (this.selectFields) {
                        this.selectFields[field] = true;
                    }
                })
                
                this.query.select = this.selectFields;

                delete this.query.include;
                
            }
            return this

    }

    include(relation: TInclude): this{
        
        if (this.selectFields) {
            return this
        }

        this.query.include = {
            ...(this.query.include as Record<string, unknown>), ...(relation as Record<string, unknown>)
        };

        return this
    }

    dynamicInclude(
        includeConfig: Record<string, unknown>,
        defaultInclude: string[] = []
    ): this{

        if (this.selectFields) {
            return this;
        }
        const result: Record<string, unknown> = {};

        defaultInclude?.forEach(field => {
            if (includeConfig[field]) {
                result[field] = includeConfig[field]
            }
        })

        const includeParam = this.queryParams.include;
        if (includeParam && typeof includeParam === 'string') {
            const requestRelations = includeParam.split(",").map(relation => relation.trim()).filter(Boolean);

            requestRelations.forEach(relation => {
                if (includeConfig[relation]) {
                    result[relation] = includeConfig[relation]
                }
            });
        }

        this.query.include = {...(this.query.include as Record<string, unknown>), ...result}


        return this
    }

    where(condition: TWhereInput): this{

        this.query.where = this.deepMerge(this.query.where as Record<string, unknown>, condition as Record<string, unknown>);

        this.countQuery.where = this.deepMerge(this.countQuery.where as Record<string, unknown>, condition as Record<string, unknown>);

        return this;
    }

    async count(): Promise<number> {
        return await this.model.count(this.countQuery as Parameters<typeof this.model.count>[0]);
    }

    getQuery(): PrismaFindManyArgs { 
        return this.query;
    }

    async execute(): Promise<IQueryResult<T>>{
        const [total, data] = await Promise.all([
            this.model.count(this.countQuery as Parameters<typeof this.model.count>[0]),
            this.model.findMany(this.query as Parameters<typeof this.model.findMany>[0])
        ])

        const totalPages = Math.ceil(total / this.limit);

        return {
            data: data as T[],
            meta: {
                page: this.page,
                limit: this.limit,
                total,
                totalPages
            }
        }
    }

    private deepMerge(target: Record<string, unknown>, source: Record<string, unknown>)
        : Record<string, unknown>{
            
        const result = { ...target };

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(key)) {
                if (result[key] && typeof result[key] === 'object' && !Array.isArray(key)) {
                    result[key] = this.deepMerge(result[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
                } else {
                    result[key] = source[key]
                }
            } else {
                result[key] = source[key]
            }
        }
        return result;
        }

    private parseFilterValue(value: unknown): unknown{
        if (value === 'true') {
            return true
        }
        if (value === 'false') {
            return false
        }
        if (typeof value === 'string' && !isNaN(Number(value)) && value !== "") {
            return Number(value)
        }

        if (Array.isArray(value)) {
            return {in : value.map(item => this.parseFilterValue(item))}
        }
        return value
    }

    private parseRangeFilter(value: Record<string, string | number>): PrismaNumberFilter | PrismaStringFilter | Record<string, unknown>{
        const rangeQuery: Record<string, string | number | (number | string)[]> = {};

        Object.keys(value).forEach(operator => {
            const operatorValue = value[operator];

            if (operatorValue === undefined) {
                return;
            }

            const parseValue = typeof operatorValue === 'string' && !isNaN(Number(operatorValue))
                ? Number(operatorValue)
                : operatorValue;

            switch (operator) {
                case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                    rangeQuery[operator] = parseValue;
                    break;
                case 'in':
                case 'notIn':
                    if (Array.isArray(operatorValue)) {
                        rangeQuery[operator] = operatorValue
                    } else {
                        rangeQuery[operator] = [parseValue]
                    }
                    break;
                default:
                    break;
            }
        });

        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value
    }
}
