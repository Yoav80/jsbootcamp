import {Group} from "./Group";
import {PhoneBookService} from "../services/phoneBookService";
export class BookItem {

    public static _id = -1;
    public name:string;
    public id:number;
    public parent:number;
    public isNew:boolean = false;

    constructor(id:number , name:string , parent: number) {

        this.name = name;
        this.parent = parent;

        if (isNaN(id) || id == null) {
            let t = BookItem.generateNextId();
            console.log("Book Item ctor ", t);
            this.id = t;
            console.log("Book Item ctor ", this.id);
        }
        else {
            this.id = id;
            this.setHeightestId(id);
        }
    }

    public getName() {
        return this.name;
    };

    public static setId (id) {
        this._id = id;
    };


    public static generateNextId() {
        return ++BookItem._id;
    }

    private setHeightestId(id) {
        if (id > BookItem._id) {
            BookItem.setId(id);
        }
    }
}