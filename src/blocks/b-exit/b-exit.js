'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iMessage from '../i-message/i-message';
import * as tpls from './b-exit.ss';
import { block, model } from '../../core/block';

@model(undefined, tpls)
@block
export default class bExit extends iMessage {}
