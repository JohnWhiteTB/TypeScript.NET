import * as ICollectionTests from './ICollection';
import Queue from '../../../../source/System/Collections/Queue';

ICollectionTests.StringCollection('Queue', new Queue<string>());
ICollectionTests.NumberCollection('Queue', new Queue<number>());
ICollectionTests.InstanceCollection('Queue', new Queue<Object>());
