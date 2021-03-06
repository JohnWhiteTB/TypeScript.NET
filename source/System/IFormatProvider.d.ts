﻿/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source:  http://referencesource.microsoft.com/#mscorlib/system/IFormatProvider.cs
 */

interface IFormatProvider
{
	getFormat(formatType:Object): Object;
}

