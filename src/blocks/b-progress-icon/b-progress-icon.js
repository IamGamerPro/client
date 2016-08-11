'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-progress-icon.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bProgressIcon extends iBlock {}
