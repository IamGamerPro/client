'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bNavList from '../b-nav-list/b-nav-list';
import * as tpls from './b-header-top-nav.ss';
import { block, model } from '../../core/block';

@model(undefined, tpls)
@block
export default class bHeaderTopNav extends bNavList {}
