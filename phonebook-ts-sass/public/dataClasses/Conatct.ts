import {BookItem} from './BookItem';
import {PhoneBookService} from "../services/phoneBookService";
import {Group} from "./Group";

export class Contact extends BookItem {


    constructor(id:number, name:string = "", parent:any = null, public firstName:string = "",
                public lastName:string = "", public phoneNumbers:Array<string> = []) {
        super(id, name, parent);
    }

}