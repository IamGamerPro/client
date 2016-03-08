'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-profile-info.ss';
import { block, model } from '../../core/block';

@model({}, tpls)

@block
export default class bProfileInfo extends iData {}
