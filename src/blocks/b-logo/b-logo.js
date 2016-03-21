'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-logo.ss';
import { block, model } from '../../core/block';

@model({tag: 'span'}, tpls)
@block
export default class bLogo extends iBlock {}
