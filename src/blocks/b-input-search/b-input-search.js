'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import bInput from '../b-input/b-input';
import * as tpls from './b-input-search.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bInputSearch extends bInput {}
