'use strict';

/* eslint-disable no-unused-vars */

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

/** @interface */
export default class VueInterface {
	$on(event: string, cb: Function) {

	}

	$off(event?: string, cb?: Function) {

	}

	$once(event: string, cb: Function) {

	}

	$emit(event: string, ...args: any) {

	}

	$watch(expOrFn: string | Function, cb: Function, opts?: {deep?: boolean, immediate?: boolean}) {

	}

	get $refs(): any {

	}

	get $options(): Object & {parentComponent: any} {

	}

	get $root(): Object {

	}
}
