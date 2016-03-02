/**
 * Created by y_mil on 2/28/2016.
 */
import {httpGet} from "./network";

export function getAllContacts(){
    httpGet("/api/contacts");
}