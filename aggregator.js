function Aggregator(){
    var _temp = [];
    var _cb = () => {};
    var _interval = 100;
    var _strategy = _sumStrategy;
    
    this.onNext = onNext;
    this.withInterval = withInterval;
    this.withCallback = withCallback;
    this.sumOutput = sumOutput;
    this.averageOutput = averageOutput;
    
    function onNext(data){
        if(_temp.length == 0){
            setTimeout(() => {
                _cb(_strategy(_temp));
                _temp = [];
            }, _interval);
        } 
        _temp.push(data);
    }
    
    function withInterval(interval){
        _interval = interval || 100;
        return this;
    }
    
    function withCallback(cb){
        _cb = cb || function() {};
        return this;
    }
    
    function sumOutput(){
        _strategy = _sumStrategy;
    }
    
    function averageOutput(){
        _strategy = _averageStrategy;
    }
    
    function _sumStrategy(arr){
        var total = 0;
        var len = arr.length;
        for(var i = 0; i < len; i++)
            total += arr[i]; 
        return total;
    }
    
    function _averageStrategy(arr){
        var total = 0;
        var len = arr.length;
        for(var i = 0; i < len; i++)
            total += arr[i]; 
        return total / len;
    }
}

module.exports = Aggregator;