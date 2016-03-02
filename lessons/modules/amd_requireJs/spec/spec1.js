/**
 * Created by y_mil on 2/28/2016.
 */
describe("network", function() {

    var _storage;

    beforeEach(function(done) {
        require(["./storage"], function(storage) {
            _storage = storage;
            done();
        });
    });

    it("should get the url", function() {
        var msg = "my test";
        var url = _storage.getAllContacts(msg);
        expect(url).toBe("httpGet: " + msg);
    });

    it("should send the contacts", function() {
        var result = _storage.setContacts();
        expect(result).toBe("data received!");
    });
});