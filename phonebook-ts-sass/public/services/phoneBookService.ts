import {appModule} from "./../appModule";
import {Group} from "./../dataClasses/Group";
import {BookItem} from "../dataClasses/BookItem";
import {Contact} from "../dataClasses/Conatct";

export class PhoneBookService {

    static $inject = ['$http', 'ENDPOINT_URI' , '$q'];

    private _root : Group = null;
    private lastGroup : Group = null;
    private groups = 'groups/';
    private contacts = 'contacts/';
    private path = 'flatJSON/';

    constructor(private $http ,private ENDPOINT_URI,private $q){
        console.log("PhoneBookService ctor");
        //this.getRoot(true);
    }

    private getUrl() {
        return this.ENDPOINT_URI + this.path;
    }

    public getRoot(reload:boolean) {

        var def = this.$q.defer();

        if (this._root && !reload) {
            def.resolve(this._root);
        }

        //let service = this;
        let p = this.getJSON();

        p.then((data) => {
            console.log("PhoneBookService data loaded successfully" , data);
            let dataObject = {
                itemInDataIndex: 0,
                data: data.data
            };

            BookItem.setId(0);
            this._root = new Group(0 , "PhoneBook", null, []);
            this._root.items = [];
            this._root.addJsonTree(dataObject);
            this.lastGroup = this._root;

            def.resolve(this._root);

        } , () => {
            console.log("error loading data, getting defaults");
            var dataObject = {
                itemInDataIndex: 0,
                data: this.getDefaults()
            };

            BookItem.setId(0);
            this._root = new Group(0 , "PhoneBook", null, []);
            this._root.items = [];
            this._root.addJsonTree(dataObject);

            def.resolve(this._root);
        });

        return def.promise;
    };

    public setRoot () {

        console.log("set root");

        var def = this.$q.defer();
        var dataToWrite = this.getFlatArrForJSON(this._root , null);
        //ataToWrite = JSON.stringify(dataToWrite);

        this.$http.post(this.getUrl(), dataToWrite)
            .then(function () {
                def.resolve({success:true});
            },function () {
                def.reject({success:false});
            });

        return def.promise;
    };

    private getFlatArrForJSON (item:any, flatArray:Array<any>) : Array<any> {

        var obj = null;
        flatArray = flatArray || [];

        if (item instanceof Group) {
            obj = {
                "type": "Group",
                "name": item.name,
                "numOfChildes": item.items.length,
                "id": item.id
            };
        }
        else if (item instanceof Contact) {
            obj = {
                "type": "Contact",
                "name": item.firstName + " " + item.lastName,
                "phoneNumbers": item.phoneNumbers,
                "id": item.id
            };
        }

        if (obj) {
            flatArray.push(obj);
        }

        if (item instanceof Group && item.items.length > 0) {
            for (var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
                this.getFlatArrForJSON(item.items[subGroupsIndex], flatArray);
            }
        }

        return flatArray;
    };

    public loadDefaults () {

        var dataObject = {
            itemInDataIndex: 0,
            data: this.getDefaults()
        };

        BookItem.setId(0);
        this._root.items = [];
        this._root.addJsonTree(dataObject);

        this.setRoot();

        return this.$q.when(this._root);
    }

    public getItem(id) {

        let def = this.$q.defer();

        if (this._root) {
            console.log("get item" , this._root);
            let item = this._root.getItemById(id);
            if (item) {
                if (item instanceof Group) {
                    this.lastGroup = item;
                }
                def.resolve(item);
            }
            else {
                def.reject({data:"no item found1"});
            }
        }
        else {
            this.getRoot(false).then( (data:Group) => {
                console.log("get item2" , data);

                let item = data.getItemById(id);
                if (item) {
                    if (item instanceof Group) {
                        this.lastGroup = item;
                    }
                    def.resolve(item);
                }
                else {
                    def.reject({data:"no item found2"});
                }
            });
        }

        return def.promise;
    }

    public getSearchResults (str) {
        if (this._root) {
            let resultsArr = this._root.getItemsByName(str, null);
            return this.$q.when({
                items: resultsArr.length ? resultsArr : [{name: "no results..", noIcon: true}],
                isSearch: true,
                parent: this.getLastGroup(),
            });
        }
        else {
            var def = this.$q.defer();

            this.getRoot(true).then((root:Group) => {
                let resultsArr = root.getItemsByName(str, null);
                console.log("getSearchResults:: ", resultsArr);
                def.resolve({
                    items: resultsArr.length ? resultsArr : [{name: "no results..", noIcon: true}],
                    isSearch: true,
                    parent: this.getLastGroup(),
                });
            });

            return def.promise;
        }
    }

    public getJSON(){

        var req = {
            method: 'GET',
            url: this.getUrl(),
            headers: {
                'Content-Type': 'text/plain'
            }
        };

        return this.$http(req);
    };

    public getDefaults () {

        var defaultJSON = '  [{"type":"Group","name":"PhoneBook","numOfChildes":4},' +
            '{"type":"Contact","name":"yoav melkman","phoneNumbers":["0542011802","65665"]},' +
            '{"type":"Contact","name":"eran melkman","phoneNumbers":["34","05555555"]},' +
            '{"type":"Group","name":"friends","numOfChildes":3},' +
            '{"type":"Contact","name":"joe retre","phoneNumbers":["3534","12313"]},' +
            '{"type":"Contact","name":"yuval ert","phoneNumbers":["0542011802","123","234234"]},' +
            '{"type":"Group","name":"best friends","numOfChildes":2},' +
            '{"type":"Contact","name":"dani miller","phoneNumbers":["234627","05555555"]},' +
            '{"type":"Contact","name":"omer cohen","phoneNumbers":["66","77"]},' +
            '{"type":"Group","name":"classmates","numOfChildes":2},' +
            '{"type":"Contact","name":"eyal masheu","phoneNumbers":["345","6575676576"]},' +
            '{"type":"Contact","name":"bar tesler","phoneNumbers":["234","45345424"]}]';

        return JSON.parse(defaultJSON);
    };

    public getLastGroup () {
        return this.lastGroup.id;
    }

    public deleteItem(id , parent) {
        var def = this.$q.defer();
        this.getItem(parent)
            .then((item:Group) => {
                let arr = item.items;
                for (let i:number=0; i<arr.length; i++) {
                    if (arr[i].id == id) {
                        arr.splice(i, 1);
                        this.setRoot();
                        return def.resolve({data:"success"});
                    }
                }

            } , () => {
                return def.reject({data:"error"});
            });
        return def.promise;
    }
}

appModule.constant('ENDPOINT_URI', 'http://localhost/phoneBook/');
appModule.service("phoneBookService", PhoneBookService);
