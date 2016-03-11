'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bInput from '../b-input/b-input';
import * as tpls from './b-textarea.ss';
import { block, model } from '../../core/block';

@model({}, tpls)
@block
export default class bTextarea extends bInput {}
