describe("test", function() {
	var n = ''
	afterEach(function(){
        console.log('测试' + n+'的结果：')
        n = ''
    });
    it("string",function(){
        expect("ABCD").toEqual(copy("ABCD"));
        expect(1).toEqual(copy(1));
        n = "string"
    });
    it('obj',function(){
    	function A(){
    		this.name = 'a'
    	}
    	var a = new A()
    	var b = copy(a)
		expect(a.__proto__.constructor).toEqual(b.__proto__.constructor);
		n = "obj"
    })
   /*it('objcircle',function(){
		const obj = {
		    foo: {
		        name: 'foo',
		        bar: {
		            name: 'bar',
		            baz: {
		                name: 'baz',
		                aChild: null
		            }
		        }
		    }
		}
		obj.foo.bar.baz.aChild = obj.foo
		n = "objcircle"
		expect(obj.__proto__.constructor).toEqual(copy(obj).__proto__.constructor);
		
    })*/
    it('date',function(){
    	var d = new Date()
    	expect(d).not.toBe(copy(d));
    	n = "date"
    })
    it('regexp',function(){
    	var reg = new RegExp('a','g')
    	var iscorrect = reg==copy(reg)
    	expect(iscorrect).toEqual(false);
    	expect(JSON.stringify(reg)).toEqual(JSON.stringify(copy(reg)));
    	n = "regexp"
    }) 
    it('function',function(){
    	var a = function(){console.log(0)}
    	var b = copy(a)
    	expect(a).not.toBe(b);
    	n = "function"
    })       
});
