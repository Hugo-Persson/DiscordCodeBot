import { additionalProperties, column, Model, primaryKey } from "./Model";

export default class Program extends Model {
    @column
    @primaryKey
    @additionalProperties({
        type: "INT(8)",
        notNull: true,
        autoIncrement: true,
    })
    public id: number;
    @column
    @additionalProperties({ type: "VARCHAR(40)", notNull: true })
    public name: string;

    @column
    @additionalProperties({ type: "VARCHAR(100)", notNull: true })
    public userId: string;

    @column
    @additionalProperties({ type: "TEXT", notNull: true })
    public code: string;

    protected static tableName = "programs";

    constructor(id?: number, name?: string, userId?: string, code?: string) {
        super();

        this.id = id;
        this.name = name;
        this.userId = userId;
        this.code = code;
    }
}
