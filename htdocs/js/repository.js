function BandRepository() {
    this.url = 'meta/band/list';
    this.handler = function (data) {};
}

BandRepository.prototype = BandRepository;
BandRepository.prototype.list = function (success) {
    this.handler = success;
    $.get(this.url, {}, this.handleData);
}

BandRepository.prototype.handleData = function (data, textStatus, jqXHR) {
    var parsedData = $.parseJSON(data);
    this.handler(parsedData);
}