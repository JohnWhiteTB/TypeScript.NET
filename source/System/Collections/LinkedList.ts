﻿/*
 * @author electricessence / https://github.com/electricessence/
 * Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */


///<reference path="ILinkedListNode.d.ts"/>
///<reference path="ILinkedList.d.ts"/>
import * as Values from '../Compare';
import * as TextUtility from '../Text/Utility';
import * as ArrayUtility from '../Collections/Array/Utility';
import * as Enumerator from './Enumeration/Enumerator';
import EnumeratorBase from './Enumeration/EnumeratorBase';

import InvalidOperationException from '../Exceptions/InvalidOperationException';

import ArgumentException from '../Exceptions/ArgumentException';
import ArgumentNullException from '../Exceptions/ArgumentNullException';
import ArgumentOutOfRangeException from '../Exceptions/ArgumentOutOfRangeException';


/*****************************
 * IMPORTANT NOTES ABOUT PERFORMANCE:
 * http://jsperf.com/simulating-a-queue
 *
 * Adding to an array is very fast, but modifying is slow.
 * LinkedList wins when modifying contents.
 * http://stackoverflow.com/questions/166884/array-versus-linked-list
 *****************************/


class Node<T>
{
	constructor(
		public value?:T,
		public prev?:Node<T>,
		public next?:Node<T>)
	{
	}

	external:ILinkedListNode<T>;

	assertDetached():void
	{
		if(this.next || this.prev)
			throw new InvalidOperationException(
				"Adding a node that is already placed.");
	}

}

function ensureExternal<T>(node:Node<T>, list:LinkedList<T>):ILinkedListNode<T>
{
	if(!node)
		return null;

	var external:ILinkedListNode<T> = node.external;
	if(!external)
		node.external = external = new LinkedListNode<T>(list, node);

	return external;
}

function getInternal<T>(node:ILinkedListNode<T>, list:LinkedList<T>):Node<T>
{
	if(!node)
		throw new ArgumentNullException(
			"Cannot be null.");

	if(node.list!=list)
		throw new InvalidOperationException(
			"Provided node does not belong to this list.");

	var n:Node<T> = (<any>node)._node;
	if(!n)
		throw new InvalidOperationException(
			"Provided node is not valid.");

	return n;
}

export default
class LinkedList<T>
implements ILinkedList<T>
{
	private _first:Node<T>;
	private _last:Node<T>;
	private _count:number;

	constructor(source?:IEnumerable<T>);
	constructor(source?:IArray<T>);
	constructor(source:any)
	{
		var _ = this, c = 0, first:Node<T> = null, last:Node<T> = null;
		var e = Enumerator.from<T>(source);

		if(e.moveNext())
		{
			first = last = new Node<T>(e.current);
			++c;
		}

		while(e.moveNext())
		{
			last = last.next = new Node<T>(e.current, last);
			++c;
		}

		_._first = first;
		_._last = last;
		_._count = c;
	}

	// #region Internals.

	private _addFirst(entry:T):Node<T>
	{
		var _ = this, first = _._first;
		var prev = new Node(entry, null, first);
		if(first)
			first.prev = prev;
		else
			_._last = prev;

		_._first = prev;

		_._count += 1;

		return prev;
	}

	private _addLast(entry:T):Node<T>
	{
		var _ = this, last = _._last;
		var next = new Node(entry, last);
		if(last)
			last.next = next;
		else
			_._first = next;

		_._last = next;
		_._count += 1;

		return next;
	}

	private _addNodeBefore(n:Node<T>, inserting:Node<T>):void
	{
		inserting.assertDetached();

		inserting.next = n;
		inserting.prev = n.prev;

		n.prev.next = inserting;
		n.prev = inserting;

		this._count += 1;
	}


	private _addNodeAfter(n:Node<T>, inserting:Node<T>):void
	{
		inserting.assertDetached();

		inserting.prev = n;
		inserting.next = n.next;

		n.next.prev = inserting;
		n.next = inserting;

		this._count += 1;
	}

	private _findFirst(entry:T):Node<T>
	{
		var equals = Values.areEqual,
		    next   = this._first;
		while(next)
		{
			if(equals(entry, next.value))
				return next;
			next = next.next;
		}
		return null;
	}

	private _findLast(entry:T):Node<T>
	{
		var equals = Values.areEqual,
		    prev   = this._last;
		while(prev)
		{
			if(equals(entry, prev.value))
				return prev;
			prev = prev.prev;
		}
		return null;
	}

	// #endregion


	// #region IEnumerateEach<T>
	forEach(
		action:Predicate<T> | Action<T>,
		useCopy:boolean = false):void
	{
		if(useCopy)
		{
			var array = this.toArray();
			ArrayUtility.forEach(array, action);
			array.length = 0;
		}
		else
		{
			var next = this._first, index:number = 0;
			while(next && <any>action(next.value, index++)!==false)
			{
				next = next.next;
			}
		}
	}

	// #endregion

	// #region IEnumerable<T>
	getEnumerator():IEnumerator<T>
	{
		var _ = this, current:Node<T>;
		return new EnumeratorBase<T>(
			() =>
			{
				current = new Node(null, null, _._first);
			}, // Initialize anchor...
			(yielder)=>
				(current = current.next)
					? yielder.yieldReturn(current.value)
					: yielder.yieldBreak()
		);
	}

	// #endregion

	// #region ICollection<T>
	get count():number
	{
		return this._count;
	}

	get isReadOnly():boolean
	{
		return false;
	}

	add(entry:T):void
	{
		this._addLast(entry);
	}


	clear():number
	{
		var _ = this;
		_._first = null;
		_._last = null;
		var count = _._count;
		_._count = 0;
		return count;
	}


	contains(entry:T):boolean
	{
		var found:boolean = false, equals = Values.areEqual;
		this.forEach(e => !(found = equals(entry, e)));
		return found;
	}

	copyTo(array:T[], index:number = 0):T[]
	{
		this.forEach(
			(entry, i) =>
			{
				array[index + i] = entry;
			}
		);

		return array;
	}

	toArray():T[]
	{
		var array = ArrayUtility.initialize<T>(this._count);
		return this.copyTo(array);
	}

	removeOnce(entry:T):boolean
	{
		var _ = this;
		var node:Node<T> = _._findFirst(entry);
		if(node)
		{
			var prev = node.prev, next = node.next;
			if(prev) prev.next = next;
			else _._first = next;
			if(next) next.prev = prev;
			else _._last = prev;

			_._count -= 1;
		}

		return node!=null;

	}

	remove(entry:T):number
	{
		var _ = this, removedCount:number = 0;
		while(_.removeOnce(entry))
		{
			++removedCount;
		}
		return removedCount;

	}

	// #endregion


	get first():ILinkedListNode<T>
	{
		return ensureExternal(this._first, this);
	}

	get last():ILinkedListNode<T>
	{
		return ensureExternal(this._last, this);
	}

	// get methods are available for convenience but is an n*index operation.

	private _getNodeAt(index:number):Node<T>
	{
		if(index<0)
			throw new ArgumentOutOfRangeException(
				'index', index, 'Is less than zero.');

		if(index>=this._count)
			throw new ArgumentOutOfRangeException(
				'index', index, 'Is greater than count.');

		var next = this._first, i:number = 0;
		while(next && index<i++)
		{
			next = next.next;
		}

		return next;

	}

	getValueAt(index:number):T
	{
		return this._getNodeAt(index).value;
	}

	getNodeAt(index:number):ILinkedListNode<T>
	{
		return ensureExternal(this._getNodeAt(index), this);
	}

	find(entry:T):ILinkedListNode<T>
	{
		return ensureExternal(this._findFirst(entry), this);
	}

	findLast(entry:T):ILinkedListNode<T>
	{
		return ensureExternal(this._findLast(entry), this);
	}

	addFirst(entry:T):void
	{
		this._addFirst(entry);
	}

	addLast(entry:T):void
	{
		this._addLast(entry);
	}

	removeFirst():void
	{
		var _ = this, first = _._first;
		if(first)
		{
			var next = first.next;
			_._first = next;
			if(next) // Might have been the last.
				next.prev = null;

			_._count -= 1;
		}
	}

	removeLast():void
	{
		var _ = this, last = _._last;
		if(last)
		{
			var prev = last.prev;
			_._last = prev;
			if(prev) // Might have been the first.
				prev.next = null;

			_._count -= 1;
		}
	}

	// Returns true if successful and false if not found (already removed).
	removeNode(node:ILinkedListNode<T>):boolean
	{
		var _ = this;
		var n:Node<T> = getInternal(node, _);
		var prev = n.prev, next = n.next, a:boolean = false, b:boolean = false;


		if(prev) prev.next = next;
		else if(_._first==n) _._first = next;
		else a = true;

		if(next) next.prev = prev;
		else if(_._last==n) _._last = prev;
		else b = true;

		if(a!==b)
		{
			throw new ArgumentException(
				'node', TextUtility.format(
					"Provided node is has no {0} reference but is not the {1} node!",
					a ? "previous" : "next", a ? "first" : "last"
				)
			);
		}

		return !a && !b;

	}

	addBefore(node:ILinkedListNode<T>, entry:T):void
	{
		this._addNodeBefore(
			getInternal(node, this),
			new Node(entry)
		);
	}


	addAfter(node:ILinkedListNode<T>, entry:T):void
	{
		this._addNodeAfter(
			getInternal(node, this),
			new Node(entry)
		);
	}

	addNodeBefore(node:ILinkedListNode<T>, before:ILinkedListNode<T>):void
	{
		this._addNodeBefore(
			getInternal(node, this),
			getInternal(before, this)
		);
	}

	addNodeAfter(node:ILinkedListNode<T>, after:ILinkedListNode<T>):void
	{
		this._addNodeAfter(
			getInternal(node, this),
			getInternal(after, this)
		);
	}


}

// Use an internal node class to prevent mucking up the LinkedList.
class LinkedListNode<T> implements ILinkedListNode<T>
{
	constructor(
		private _list:LinkedList<T>,
		private _node:Node<T>)
	{
	}

	get list():LinkedList<T>
	{
		return this._list;
	}

	get previous():ILinkedListNode<T>
	{
		return ensureExternal(this._node.prev, this._list);
	}

	get next():ILinkedListNode<T>
	{
		return ensureExternal(this._node.next, this._list);
	}

	get value():T
	{
		return this._node.value;
	}

	set value(v:T)
	{
		this._node.value = v;
	}

	addBefore(entry:T):void
	{
		this._list.addBefore(this, entry);
	}

	addAfter(entry:T):void
	{
		this._list.addAfter(this, entry);
	}

	addNodeBefore(before:ILinkedListNode<T>):void
	{
		this._list.addNodeBefore(this, before);
	}

	addNodeAfter(after:ILinkedListNode<T>):void
	{
		this._list.addNodeAfter(this, after);
	}

	remove():void
	{
		this._list.removeNode(this);
	}

}

