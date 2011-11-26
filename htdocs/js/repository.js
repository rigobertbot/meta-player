/***************************************
 *********** BaseRepository ************
 ***************************************/
function BaseRepository() {
    this.url = undefined;
}

BaseRepository.prototype = BaseRepository;
BaseRepository.prototype.list = function (success) {
    var url = this.url + 'list';
    $.getJSON(url, undefined, function (data, textStatus, jqXHR) {
            var parsedData = $.parseJSON(data);
            success(parsedData);
    });
}

BaseRepository.prototype.get = function (id, success) {
    var url = this.url + 'get';
    $.getJSON(url, {"id": id}, function (data, textStatus, jqXHR) {
            var parsedData = $.parseJSON(data);
            success(parsedData);
    });
}

/***************************************
 *********** BandRepository ************
 ***************************************/
function BandRepository() {
    this.parent();
    this.url = '/meta/band/';
}

BandRepository.prototype = new BaseRepository();
BandRepository.prototype.parent = BaseRepository;