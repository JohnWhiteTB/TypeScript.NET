/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Based on: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 */

/**
 * https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 *
 * ```
 *    urn:example:mammal:monotreme:echidna
 *    ??? ????????????????????????????????
 *   scheme             path
 * ```
 */
interface IUrn {

	/**
	 * The scheme name for this URI.
	 */
	scheme?:string;

	/**
	 * The absolute path of the URI.
	 */
	path?:string;

}

/**
 * https://en.wikipedia.org/wiki/Uniform_Resource_Identifier
 * scheme:[//[user:password@]domain[:port]][/]path[?query][#fragment]
 *
 * ```
 *                      hierarchical part
 *          ???????????????????????????????????????????
 *                      authority               path
 *          ???????????????????????????????????????????
 *    abc://username:password@example.com:123/path/data?key=value#fragid1
 *    ???   ????????????????? ??????????? ???           ????????? ???????
 *  scheme  user information     host     port            query   fragment
 * ```
 */
interface IUri extends IUrn {


	/**
	 * The user name, password, or other user-specific information associated with the specified URI.
	 */
	userInfo?:string;

	/**
	 * The host component of this instance.
	 */
	host?:string;

	/**
	 * The port number of this URI.
	 */
	port?:number;

	/**
	 * Gets any query information included in the specified URI.
	 */
	query?:string;

	/**
	 * The escaped URI fragment.
	 */
	fragment?:string;


}
