﻿///<reference path="../System.ts"/>
///<reference path="../Text/Text.ts"/>

/*
* @author electricessence / https://github.com/electricessence/
* Based Upon: http://msdn.microsoft.com/en-us/library/he2s3bh7%28v=vs.110%29.aspx
* Liscensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE
*/

module System.Collections
{
	/*****************************
	* IMPORTANT NOTES ABOUT PERFORMANCE:
	* http://jsperf.com/simulating-a-queue
	*
	* Adding to an array is very fast, but modifying is slow.
	* LinkedList wins when modifying contents.
	*****************************/

	export interface ILinkedListNode<T>
	{

		list: LinkedList<T>;

		previous: ILinkedListNode<T>;
		next: ILinkedListNode<T>;
		value: T;

		addBefore(entry: T): void;
		addAfter(entry: T): void;

		addNodeBefore(before: ILinkedListNode<T>): void;
		addNodeAfter(after: ILinkedListNode<T>): void;

	}

	var INT_0: number = 0 | 0;
	var INT_1: number = 1 | 0;

	class Node<T>
	{
		constructor(
			public value: T,
			public prev?: Node<T>,
			public next?: Node<T>) { }

		external: LinkedListNode<T>;

		assertDetached(): void
		{
			if (this.next || this.prev)
				throw new Error("InvalidOperationException: adding a node that is already placed.");
		}

	}

	function ensureExternal<T>(node: Node<T>, list: LinkedList<T>): ILinkedListNode<T>
	{
		if (!node)
			return null;

		var external: ILinkedListNode<T> = node.external;
		if(!external)
			node.external = external = new LinkedListNode<T>(list, node);

		return external;
	}

	function getInternal<T>(node: ILinkedListNode<T>, list: LinkedList<T>): Node<T>
	{
		if (!node)
			throw new Error("ArgumentNullException: 'node' cannot be null.");

		if (node.list != list)
			throw new Error("InvalidOperationException: provided node does not belong to this list.");

		var n: Node<T> = (<any>node)._node;
		if (!n)
			throw new Error("InvalidOperationException: provided node is not valid.");

		return n;
	}

	export class LinkedList<T> implements ICollection<T>, IEnumerateEach<T>
	{
		constructor(source?: IEnumerable<T>);
		constructor(source?: IArray<T>);
		constructor(source:any)
		{
			// TODO
		}

		// #region Internals.
		private _first: Node<T>;
		private _last: Node<T>;
		private _count: number = INT_0;

		private _addFirst(entry: T): Node<T>
		{
			var _ = this, first = _._first;
			var next = new Node(entry, null, first);
			if (first)
				first.prev = next;
			else
				_._first = _._last = next;

			_._count += INT_1;

			return next;
		}

		private _addLast(entry: T): Node<T>
		{
			var _ = this, last = _._last;
			var next = new Node(entry, last);
			if (last)
				last.next = next;
			else
				_._first = _._last = next;

			_._count += INT_1;

			return next;
		}

		private _addNodeBefore(n: Node<T>, inserting: Node<T>): void
		{
			inserting.assertDetached();

			inserting.next = n;
			inserting.prev = n.prev;

			n.prev.next = inserting;
			n.prev = inserting;

			this._count += INT_1;
		}


		private _addNodeAfter(n: Node<T>, inserting: Node<T>): void
		{
			inserting.assertDetached();

			inserting.prev = n;
			inserting.next = n.next;

			n.next.prev = inserting;
			n.next = inserting;

			this._count += INT_1;
		}

		private _findFirst(entry: T): Node<T>
		{
			var equals = System.areEqual,
				next = this._first;
			while (next)
			{
				if (equals(entry, next.value))
					return next;
				next = next.next;
			}
			return null;
		}

		private _findLast(entry: T): Node<T>
		{
			var equals = System.areEqual,
				prev = this._last;
			while (prev)
			{
				if (equals(entry, prev.value))
					return prev;
				prev = prev.prev;
			}
			return null;
		}
		
		// #endregion


		// #region IEnumerateEach<T>
		forEach(action: System.Predicate<T>): void;
		forEach(action: System.Action<T>): void;
		forEach(action: (element: T, index?: number) => any): void
		{
			var next = this._first, index: number = INT_0;
			while (next && action(next.value, index++) !== false)
			{
				next = next.next;
			}
		}
		// #endregion

		// #region IEnumerable<T>
		getEnumerator(): IEnumerator<T>
		{
			var _ = this, current: Node<T>;
			return new EnumeratorBase<T>(
				() => { current = new Node(null, null, _._first); }, // Initialize anchor...
				yielder =>
					(current = current.next)
						? yielder.yieldReturn(current.value)
						: yielder.yieldBreak()
			);
		}
		// #endregion

		// #region ICollection<T>
		get count(): number
		{
			return this._count;
		}

		get isReadOnly(): boolean
		{
			return false;
		}

		add(entry: T): void
		{
			this._addLast(entry);
		}


		clear(): number
		{
			var _ = this;
			_._first = null;
			_._last = null;
			var count = _._count;
			_._count = 0;
			return count;
		}

		
		contains(entry: T): boolean
		{
			var found: boolean = false, equals = System.areEqual;
			this.forEach(e => !(found = equals(entry, e)));
			return found;
		}

		copyTo(array: T[], index: number = 0): void
		{
			this.forEach((entry, i) =>
			{
				array[index + i] = entry;
			});
		}

		removeOnce(entry: T): boolean
		{
			var _ = this;
			var node: Node<T> = _._findFirst(entry);
			if(node)
			{
				var prev = node.prev, next = node.next;
				if (prev) prev.next = next;
				else _._first = next;
				if (next) next.prev = prev;
				else _._last = prev;

				_._count -= INT_1;
			}

			return node!=null;

		}

		remove(entry: T): number
		{
			var _ = this, removedCount:number = INT_0;
			while (_.removeOnce(entry))
			{
				++removedCount;
			}
			return removedCount;

		}
		// #endregion

		get first(): ILinkedListNode<T>
		{
			return ensureExternal(this._first, this);
		}

		get last(): ILinkedListNode<T>
		{
			return ensureExternal(this._last, this);
		}

		find(entry: T): ILinkedListNode<T>
		{
			return ensureExternal(this._findFirst(entry), this);
		}

		findLast(entry: T): ILinkedListNode<T>
		{
			return ensureExternal(this._findLast(entry), this);
		}

		addFirst(entry: T): void
		{
			this._addFirst(entry);
		}

		addLast(entry: T): void
		{
			this._addLast(entry);
		}

		removeFirst(): void
		{
			var _ = this, first = _._first;
			if (first)
			{
				var next = first.next;
				_._first = next;
				if (next)
					next.prev = null;

				_._count -= INT_1;
			}
		}

		removeLast(): void
		{
			var _ = this, last = _._last;
			if (last)
			{
				var prev = last.prev;
				_._last = prev;
				if(prev)
					prev.next = null;

				_._count -= INT_1;
			}
		}

		// Returns true if sucessful and false if not found (already removed).
		removeNode(node: ILinkedListNode<T>): boolean
		{
			var _ = this;
			var n: Node<T> = getInternal(node, _);
			var prev = n.prev, next = n.next, a:boolean = false, b:boolean = false;


			if (prev) prev.next = next;
			else if (_._first == n) _._first = next;
			else a = true;

			if (next) next.prev = prev;
			else if (_._last == n) _._last = prev;
			else b = true;

			if (a !== b)
			{
				throw new Error(System.Text.format(
					"Exception: provided node is has no {0} reference but is not the {1} node!", a ? "previous" : "next", a ? "first" : "last"));
			}

			return !a && !b;

		}

		addBefore(node: ILinkedListNode<T>, entry: T): void
		{
			this._addNodeBefore(
				getInternal(node, this),
				new Node(entry));
		}
		

		addAfter(node:ILinkedListNode<T>, entry:T):void
		{
			this._addNodeAfter(
				getInternal(node, this),
				new Node(entry));
		}

		addNodeBefore(node: ILinkedListNode<T>, before: ILinkedListNode<T>): void
		{
			this._addNodeBefore(
				getInternal(node, this),
				getInternal(before, this));
		}

		addNodeAfter(node: ILinkedListNode<T>, after: ILinkedListNode<T>): void
		{
			this._addNodeAfter(
				getInternal(node, this),
				getInternal(after, this));
		}
		


	}

	// Use an internal node class to prevent mucking up the LinkedList.
	class LinkedListNode<T> //implements ILinkedListNode<T>
	{
		constructor(
			private _list: System.Collections.LinkedList<T>,
			private _node: Node<T>)
		{
		}

		get list(): LinkedList<T>
		{
			return this._list;
		}

		get previous(): ILinkedListNode<T>
		{
			return ensureExternal(this._node.prev, this._list);
		}
		get next(): ILinkedListNode<T>
		{
			return ensureExternal(this._node.next, this._list);
		}
		get value(): T
		{
			return this._node.value;
		}
		set value(v: T)
		{
			this._node.value = v;
		}

		addBefore(entry: T): void
		{
			this._list.addBefore(this, entry);
		}

		addAfter(entry: T): void
		{
			this._list.addAfter(this, entry);
		}

		addNodeBefore(before: ILinkedListNode<T>): void
		{
			this._list.addNodeBefore(this, before);
		}

		addNodeAfter(after: ILinkedListNode<T>): void
		{
			this._list.addNodeAfter(this, after);
		}

	}



} 
