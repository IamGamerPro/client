'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import bLink from '../b-link/b-link';
import * as tpls from './b-pseudo-link.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bPseudoLink extends bLink {}
