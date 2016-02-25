var socket = io();
var viewModel = new ViewModel();

socket.on('rotate', function (val) {
    if (val > 2) {
        viewModel.next();
    } else if (val < 2) {
        viewModel.previous();
    }
});

socket.on('swipe', function (val) {
    if (val == 1) {
        viewModel.next();
    } else if (val == 0){
        viewModel.previous();
    }
});

socket.on('click', function () {
    viewModel.click();
});

zenscroll.setup(null, 100);

function Person(id, name, bio) {
    var self = this;
    this.id = 'img' + id;
    this.name = name;
    this.bio = bio;
    this.image = '/images/'+name+'.jpg';
    this.active = ko.observable(false);

    this.active.subscribe(function (newVal) {
        if (newVal) {
            var e = document.getElementById(self.id);
            if (e) {
                zenscroll.intoView(e);
            }
        }
    });
}

function ViewModel() {
    var self = this;
    this.person = ko.observable();
    this.people = [];
    this.selectedIndex = ko.observable(0);
    this.next = next;
    this.previous = previous;
    this.click = click;
    this.modalVisible = false;

    this.selectedIndex.subscribe(function (oldIndex) {
        self.people[oldIndex].active(false);
    }, null, "beforeChange");

    this.selectedIndex.subscribe(function (newIndex) {
        self.people[newIndex].active(true);
    });

    function next() {
        if(!this.modalVisible){
            this.selectedIndex((this.selectedIndex() + 1) % this.people.length);
        }   
    }

    function previous() {
        if(!this.modalVisible){
            var newIndex = this.selectedIndex() - 1;
            this.selectedIndex(newIndex < 0 ? this.people.length - 1 : newIndex);
        }
    }

    function click() {
        if(this.modalVisible){
            $('.ui.basic.modal').modal('hide');
        } else {
            this.person(this.people[this.selectedIndex()]);
            $('.ui.basic.modal').modal('show');
        }
        this.modalVisible = !this.modalVisible;
    }

    var names = 
    [{name: 'Ade', bio: 'Ade likes books'},
     {name: 'Chris', bio: 'Chris likes video games'},
     {name: 'Jenny', bio: 'Jenny likes long walks on the beach'},
     {name: 'Justen', bio: 'Justen likes mountain biking'},
     {name: 'Nan', bio: 'Nan enjoys surfing'},
     {name: 'Stevie', bio: 'Stevie is a code monkey'},
     {name: 'Veronika', bio: 'Veronika Vaughn...'},
     {name: 'Ade', bio: 'Ade likes books'},
     {name: 'Chris', bio: 'Chris likes video games'},
     {name: 'Jenny', bio: 'Jenny likes long walks on the beach'},
     {name: 'Justen', bio: 'Justen likes mountain biking'},
     {name: 'Nan', bio: 'Nan enjoys surfing'},
     {name: 'Stevie', bio: 'Stevie is a code monkey'},
     {name: 'Veronika', bio: 'Veronika Vaughn...'}];
    for (var i = 0, len = names.length; i < len; i++) {
        var person = new Person(i, names[i].name, names[i].bio);
        person.active(i == this.selectedIndex());
        this.people.push(person);
    }
}

ko.applyBindings(viewModel);