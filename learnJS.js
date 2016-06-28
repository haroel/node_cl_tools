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


let errorlog = "?:95: attempt to index a nil valuestack traceback:?:106: in function <?:103>?:95: in function <?:69>(tail call): ??:1509: in function <?:1508>(tail call): ??:48: in function 'setCurState'?:416: in function 'tryEnterState'?:1826: in function <?:1780>(tail call): ??:48: in function 'setCurState'?:416: in function 'tryEnterState'?:372: in function 'resetSoldierState'?:179: in function 'checkDefendSoldierReach'?:90: in function 'update'?:356: in function 'update'?:257: in function 'update'?:392: in function 'update'?:554: in function 'updateDetailLayer'?:473: in function 'update'?:1191: in function 'update'?:329: in function 'update'?:64: in function <?:58>";
let reg = /\'(\w+)\'\?\:(\d+)/gm;

let params = [];
let execRets = reg.exec(errorlog);
while(execRets)
{
    params.push({name:execRets[1],num:execRets[2]});
    execRets = reg.exec(errorlog);
}

trace(params.toString());
