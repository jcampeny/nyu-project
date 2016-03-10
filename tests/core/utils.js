describe('Utils', function() {
  var scope, ArrayService;

  beforeEach(module("app"));

  beforeEach(inject(function (_ArrayService_) {
    ArrayService = _ArrayService_;
  }));

  it("Sort by property",function(){
    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:3,name:"c"},{id:4,name:"b"},{id:5,name:"a"}];
    var b = ArrayService.arraySortByProperty(a,'id','ASC');
    expect(b[0].id).toBe(1);
    expect(b[4].id).toBe(5);

    var c = ArrayService.arraySortByProperty(a,'id','DESC');
    expect(c[0].id).toBe(5);
    expect(c[4].id).toBe(1);

    var d = ArrayService.arraySortByProperty(a,'name','ASC');
    expect(d[0].id).toBe(5);
    expect(d[4].id).toBe(1);

    var e = ArrayService.arraySortByProperty(a,'name','DESC');
    expect(e[0].id).toBe(1);
    expect(e[4].id).toBe(5);
  });

  it("Remove from array",function(){
    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:3,name:"c"},{id:4,name:"b"},{id:5,name:"a"}];

    var b = ArrayService.removeFromArray(a,{id:2,name:"d"},'id');
    expect(b.length).toBe(4);

    var c = ArrayService.removeFromArray(a,{id:2,name:"d"},'name');
    expect(b.length).toBe(4);

    var e = ArrayService.removeFromArray(a,{id:6,name:"f"},'id');
    expect(e.length).toBe(5);
  });

  it("Array to set",function(){
    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b"},{id:5,name:"a"}];

    var b = ArrayService.arrayToSet(a,'id');
    expect(b.length).toBe(4);

    var c = ArrayService.arrayToSet(a,'name');
    expect(c.length).toBe(5);

    a[1].name = "e";
    var d = ArrayService.arrayToSet(a,'name');
    expect(d.length).toBe(4);
  });

  it("Add to set", function(){
    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b"},{id:5,name:"a"}];
    var b = ArrayService.addToSet(a, {id:2,name:"f"}, 'id');
    expect(b.length).toBe(5);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b"},{id:5,name:"a"}];
    var c = ArrayService.addToSet(a, {id:6,name:"e"}, 'id');
    expect(c.length).toBe(6);
    expect(c[5].id).toBe(6);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b"},{id:5,name:"a"}];
    var d = ArrayService.addToSet(a, {id:6,name:"e"}, 'id', "END");
    expect(d.length).toBe(6);
    expect(d[5].id).toBe(6);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b"},{id:5,name:"a"}];
    var e = ArrayService.addToSet(a, {id:2,name:"f"}, 'name', "INI");
    expect(e.length).toBe(6);
    expect(e[0].id).toBe(2);
  });

  it("Array update", function(){
    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]},{id:5,name:"a"}];
    var b = ArrayService.arrayUpdate(a, {id:2,name:"f"}, 'id');
    expect(b[1].name).toBe("f");
    expect(b[1].id).toBe(2);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]},{id:5,name:"a"}];
    var c = ArrayService.arrayUpdate(a, {id:2,name:"f"}, 'id', true);
    expect(c[1].name).toBe("f");
    expect(c[1].id).toBe(2);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]},{id:5,name:"a"}];
    var d = ArrayService.arrayUpdate(a, {id:2,name:"f"}, 'name');
    expect(d[1].name).toBe("d");
    expect(d[1].id).toBe(2);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]},{id:5,name:"a"}];
    var e = ArrayService.arrayUpdate(a, {id:2,name:"c"}, 'name');
    expect(e[2].name).toBe("c");
    expect(e[1].id).toBe(2);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]},{id:5,name:"a"}];
    var f = ArrayService.arrayUpdate(a, {id:4,name:"f", arr: [{id:41, name:"f-1"},{id:43, name:"f-3"}]}, 'id');
    expect(f[3].name).toBe("f");
    expect(f[3].id).toBe(4);
    expect(f[3].arr[0].name).toBe("f-1");
    expect(f[3].arr.length).toBe(2);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]},{id:5,name:"a"}];
    var g = ArrayService.arrayUpdate(a, {id:4,name:"g", arr: [{id:41, name:"g-1"},{id:43, name:"g-3"}]}, 'id', false);
    expect(g[3].name).toBe("g");
    expect(g[3].id).toBe(4);
    expect(g[3].arr[0].name).toBe("g-1");
    expect(g[3].arr.length).toBe(2);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:1,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]},{id:5,name:"a"}];
    var h = ArrayService.arrayUpdate(a, {id:4,name:"h", arr: [{id:41, name:"g-1"},{id:42, name:"g-2"},{id:43, name:"b-3"}]}, 'id', true);
    expect(h[3].name).toBe("h");
    expect(h[3].id).toBe(4);
    expect(h[3].arr.length).toBe(3);
    expect(h[3].arr[0].name).toBe("g-1");
    expect(h[3].arr[1].name).toBe("g-2");
    expect(h[3].arr[2].name).toBe("b-3");
  });

  it("Merge array data",function(){
    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:3,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]}];
    var b = [{id:1,name:"e_new"},{id:2,name:"d"},{id:3,name:"c_new"},{id:4,name:"b", arr: [{id:41, name:"b-1_new"},{id:42, name:"b-2"},{id:43, name:"b-3_new"},{id:44, name:"b-4"}]},{id:5,name:"a"}];
    var c = ArrayService.mergeArrayData(a, b, 'id');
    expect(c[0].name).toBe("e_new");
    expect(c.length).toBe(5);
    expect(c[4].id).toBe(5);
    expect(c[4].name).toBe("a");
    expect(c[2].name).toBe("c_new");
    expect(c[3].arr.length).toBe(4);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:3,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]}];
    var b = [{id:1,name:"e_new"},{id:2,name:"d"},{id:3,name:"c_new"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3_new"},{id:44, name:"b-4"}]},{id:5,name:"a"}];
    var d = ArrayService.mergeArrayData(a, b, 'id', "INI");
    expect(d[1].name).toBe("e_new");
    expect(d.length).toBe(5);
    expect(d[0].id).toBe(5);
    expect(d[0].name).toBe("a");
    expect(d[3].name).toBe("c_new");
    expect(d[4].arr.length).toBe(4);

    var a = [{id:1,name:"e"},{id:2,name:"d"},{id:3,name:"c"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3"}]}];
    var b = [{id:1,name:"e_new"},{id:2,name:"d"},{id:3,name:"c_new"},{id:4,name:"b", arr: [{id:41, name:"b-1"},{id:42, name:"b-2"},{id:43, name:"b-3_new"},{id:44, name:"b-4"}]},{id:5,name:"a"}];
    var e = ArrayService.mergeArrayData(a, b, 'id', "END");
    expect(e[0].name).toBe("e_new");
    expect(e.length).toBe(5);
    expect(e[4].id).toBe(5);
    expect(e[4].name).toBe("a");
    expect(e[2].name).toBe("c_new");
    expect(e[3].arr.length).toBe(4);
  });
});
