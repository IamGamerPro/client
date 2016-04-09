'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bLink from '../b-link/b-link';
import * as tpls from './b-pseudo-link.ss';
import { block, model } from '../../core/block';

@model(undefined, tpls)
@block
export default class bPseudoLink extends bLink {}
