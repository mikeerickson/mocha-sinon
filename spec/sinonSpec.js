/**
 * SinonSpec.js
 * Mike Erickson <codedungeon@gmail.com>
 * 2016.05.25 12:20 (mikee)
 * =============================================================================
 */

/*global require*/

var chai   = require('chai')
var expect = chai.expect
var should = chai.should();
var assert = chai.assert;
var sinon  = require('sinon');
var msg    = require('gulp-messenger');
var store  = require('store2');

describe('doing some Sinon Work', function() {

	var user; // make sure variables are defined outside of all the blocks
	
	beforeEach(function(){
		user = {
			fname: '<fname>',
			lname: '<lname>',
			setFirstName: function (fname) {
				this.fname = fname;
				return this;
			},
			setLastName: function (lname) {
				this.lname = lname;
				return this;
			},
			getFullName: function () {
				return this.fname + ' ' + this.lname;
			}
		}
	})

	describe('should use sinon correctly', function() {

		it('should first use spies',function(done) {
			var spy = sinon.spy();

			//We can call a spy like a function
			spy('Hello', 'World');

			var result = spy.firstCall.args;

			done();
		});

		it('should do some more spying',function(done) {

			//Create a spy for the setName function
			var setFirstName = sinon.spy(user, 'setFirstName');
			var setLastName  = sinon.spy(user, 'setLastName');
			var getFullName  = sinon.spy(user, 'getFullName');

			//Now, any time we call the function, the spy logs information about it
			user.setFirstName('Mike').setLastName('Erickson');
			user.setFirstName('Kira').setLastName('Erickson');
			user.setFirstName('Joelle').setLastName('Asoau');
			user.setFirstName('Brady').setLastName('Erickson');
			user.setFirstName('Bailey').setLastName('Erickson');
			user.setFirstName('Trevor').setLastName('Erickson');


			var fullName = user.getFullName();
			expect(fullName).to.equal('Trevor Erickson')

			//Which we can see by looking at the spy object
			expect(setFirstName.callCount).to.equal(6)
			expect(setLastName.callCount).to.equal(6)
			getFullName.callCount.should.equal(1)

			//Important final step - remove the spy
			setFirstName.restore();
			setLastName.restore();
			getFullName.restore();

			// make sure we restored everything correctly
			user.setFirstName('Brady').setLastName('Erickson')
			fullName = user.getFullName('Brady Erickson')
			assert(fullName,'Brady Erickson');

			done();
		});

	});

	describe('spy on function', function() {
		it('should should call `callback` function',function(done) {

			// Arrange
			var cb = function() {
				console.log('original callback called');
			}
			var cb = sinon.spy();

			// Act
			myFunction(true, cb);
			myFunction(false, cb);
			myFunction(true, cb);
			myFunction(true, cb);

			// Assert
			// assert(callback.calledOnce,'Appears callback was called more than once, now what?');
			assert(cb.calledThrice,'Callback should have been executed twice...');

			done();
		});
		it('should use `sinon` assertions',function(done) {

			var cb = sinon.spy();

			myFunction(true, cb)

			sinon.assert.calledOnce(cb);

		  done();
		});

		it('should should confirm function called with required parameters',function(done) {

			var user = {
				fname: 'Mike',
				lname: 'Erickson'
			}

			var spy = sinon.spy();
			spy(user)

			sinon.assert.calledWith(spy, sinon.match({fname: 'Mike'}))
			sinon.assert.calledWith(spy, sinon.match({lname: 'Erickson'}))

		  done();
		});
	});

	describe('sinon stubs', function() {

		it('should create basic stub',function(done) {

			// arrange
			var stub = sinon.stub();

			// act
			stub('hello timmy');

			// assert
			var args = stub.firstCall.args;
			args.should.be.object;

			done();
		});

		it('should stub user.setLastName',function(done) {

			// Arrange
			var setLastName  = sinon.stub(user, 'setLastName');
			var setFirstName = sinon.stub(user, 'setFirstName');
			var getFullName  = sinon.stub(user, 'getFullName');

			// Act
			user.setFirstName('Timmy');
			user.setLastName('Erickson');
			var stubFullName = user.getFullName();

			// Assert
			expect(stubFullName).to.be.undefined;
			sinon.assert.calledOnce(setFirstName);
			sinon.assert.calledOnce(setLastName);
			sinon.assert.calledOnce(getFullName);

			// Restore functions
			setFirstName.restore();
			setLastName.restore();
			getFullName.restore();

			// now make sure we can use original functions
			user.setFirstName('Mike').setLastName('Erickson')
			var fullName = user.getFullName();
			expect(fullName).to.equal('Mike Erickson');

		  done();
		});
	});
	
	describe('mock store access', function() {
		
		it('should store data in localStorage', sinon.test(function(done) {

			// arrange
			var storeMock = sinon.mock(store);
			storeMock.expects('get').withArgs('data').returns(0);
			storeMock.expects('set').once().withArgs('data', 23);

			// act
			var result = incrementTotal('data', 23);

			// assert
			expect(result).to.equal(23);

			// cleanup / restore
			storeMock.restore();
			storeMock.verify();


			done();
		}));

	});

});


// testing utility functions

function myFunction(condition, cb){
	if (condition) { cb(); }
}

function incrementTotal(value, amount){
	var total    = store.get(value) || 0;
	var newTotal = total + amount;
	store.set(value, newTotal);
	return newTotal;
}