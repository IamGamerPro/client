'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-group.ss';
import { block, model } from '../../core/block';

@model(undefined, tpls)
@block
export default class bGroup extends iData {}