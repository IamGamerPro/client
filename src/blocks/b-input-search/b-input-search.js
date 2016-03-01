'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bInput from '../b-input/b-input';
import * as tpls from './b-input-search.ss';
import { block, model } from '../../core/block';

@model(undefined, tpls)
@block
export default class bInputSearch extends bInput {}
