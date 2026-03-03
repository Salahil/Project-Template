import {
  MAT_ERROR,
  MAT_FORM_FIELD,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MAT_PREFIX,
  MAT_SUFFIX,
  MatError,
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
  getMatFormFieldDuplicatedHintError,
  getMatFormFieldMissingControlError,
  getMatFormFieldPlaceholderConflictError
} from "./chunk-ENLN77T3.js";
import "./chunk-NKW3RSBS.js";
import "./chunk-VV6OM3VI.js";
import "./chunk-R3O5TWPN.js";
import "./chunk-MWMPVRZI.js";
import "./chunk-2ALDQT4G.js";
import "./chunk-KCIEWYD7.js";
import "./chunk-X5LAE3LL.js";
import "./chunk-MQEKF7ET.js";
import "./chunk-I3JKHFQ7.js";
import "./chunk-X22YT5BU.js";
import "./chunk-OQ6DXLKJ.js";
import "./chunk-YCTTP2WZ.js";
import "./chunk-DMQQWF5P.js";
import "./chunk-H45KYNBG.js";
import "./chunk-FCQS5FBR.js";
import "./chunk-ZAZL6QHD.js";
import "./chunk-K54N5JWA.js";
import "./chunk-ZDCBCHSO.js";
import "./chunk-CNZCHWBN.js";
import "./chunk-FZRZS4BH.js";
import "./chunk-SGSDSUZO.js";
import "./chunk-PGBELSAS.js";
import "./chunk-WDMUDEB6.js";

// ../../node_modules/@angular/material/fesm2022/form-field.mjs
var matFormFieldAnimations = {
  // Represents:
  // trigger('transitionMessages', [
  //   // TODO(mmalerba): Use angular animations for label animation as well.
  //   state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
  //   transition('void => enter', [
  //     style({opacity: 0, transform: 'translateY(-5px)'}),
  //     animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
  //   ]),
  // ])
  /** Animation that transitions the form field's error and hint messages. */
  transitionMessages: {
    type: 7,
    name: "transitionMessages",
    definitions: [{
      type: 0,
      name: "enter",
      styles: {
        type: 6,
        styles: {
          opacity: 1,
          transform: "translateY(0%)"
        },
        offset: null
      }
    }, {
      type: 1,
      expr: "void => enter",
      animation: [{
        type: 6,
        styles: {
          opacity: 0,
          transform: "translateY(-5px)"
        },
        offset: null
      }, {
        type: 4,
        styles: null,
        timings: "300ms cubic-bezier(0.55, 0, 0.55, 0.2)"
      }],
      options: null
    }],
    options: {}
  }
};
export {
  MAT_ERROR,
  MAT_FORM_FIELD,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MAT_PREFIX,
  MAT_SUFFIX,
  MatError,
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix,
  getMatFormFieldDuplicatedHintError,
  getMatFormFieldMissingControlError,
  getMatFormFieldPlaceholderConflictError,
  matFormFieldAnimations
};
//# sourceMappingURL=@angular_material_form-field.js.map
