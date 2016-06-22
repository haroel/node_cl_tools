'use strict';
var trace = console.log
trace("hello");
trace("test work!");

var re = /^(\d+?)/
trace(re.exec("102300"));

trace(/[，]+/.test('hello，world'));
// false
trace(/^\uD83D/.test('\uD83D\uDC2A'));
// true
var obj = {
    birth: 1990,
    getAge: function (year) {
        var b = this.birth; // 1990
        // var fn = (y) => y - this.birth; // this.birth仍是1990

        var fn = function (year) {
            return year - this.birth; // this指向window或undefined
        };

        return fn.call(this, year);
    }
};
trace(obj.getAge(2015)); // 25

var name = "The Window";
　　var object = {
　　　　name : "My Object",
　　　　getNameFunc : function(){
			var that = this;
　　　　　　return function(){
　　　　　　　　return that.name;
　　　　　　};
　　　　}
　　};
trace(object.getNameFunc()());
//
var alert = trace;
function Student(name)
{
    trace("do Student()");
    this.name = name;
}
Student.prototype = {
    hello :function ()
    {
    	alert("hello " + this.name);
    }
}
function PrimaryStudent(grade)
{
    trace("do PrimaryStudent()");
    this.grade = grade;
}
function F(){
    trace("do F()");
};
F.prototype = Student.prototype;

// 下面是重点
PrimaryStudent.prototype = new F()
// PrimaryStudent.prototype.constructor = PrimaryStudent大肥面壁
PrimaryStudent.prototype.say = function()
{
	this.hello();
	alert("my grade is " + this.grade);
}
var priStudent = new PrimaryStudent(99);

priStudent.say()
trace( priStudent.constructor.toString() );


setTimeout( value=>{
    alert(value);
},1.2,['a','b'] );

