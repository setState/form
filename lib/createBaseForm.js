'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.has');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.set');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_VALIDATE_TRIGGER = 'onChange';
var DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;
var atom = {};

function createBaseForm() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mixins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var mapPropsToFields = option.mapPropsToFields,
      onFieldsChange = option.onFieldsChange,
      fieldNameProp = option.fieldNameProp,
      fieldMetaProp = option.fieldMetaProp,
      validateMessages = option.validateMessages,
      _option$mapProps = option.mapProps,
      mapProps = _option$mapProps === undefined ? _utils.mirror : _option$mapProps,
      _option$formPropName = option.formPropName,
      formPropName = _option$formPropName === undefined ? 'form' : _option$formPropName,
      withRef = option.withRef;


  function decorate(WrappedComponent) {
    var Form = _react2["default"].createClass({
      displayName: 'Form',

      mixins: mixins,

      getInitialState: function getInitialState() {
        var fields = void 0;
        if (mapPropsToFields) {
          fields = mapPropsToFields(this.props);
        }
        this.fields = fields || {};
        this.instances = {};
        this.fieldsMeta = {};
        this.cachedBind = {};
        return {
          submitting: false
        };
      },
      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (mapPropsToFields) {
          this.fields = mapPropsToFields(nextProps);
        }
      },
      onChange: function onChange(name_, action) {
        var name = name_;
        var fieldMeta = this.getFieldMeta(name);
        var validate = fieldMeta.validate;

        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        if (fieldMeta[action]) {
          fieldMeta[action].apply(fieldMeta, args);
        } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
          var _fieldMeta$originalPr;

          (_fieldMeta$originalPr = fieldMeta.originalProps)[action].apply(_fieldMeta$originalPr, args);
        }
        var value = fieldMeta.getValueFromEvent ? fieldMeta.getValueFromEvent.apply(fieldMeta, args) : _utils.getValueFromEvent.apply(undefined, args);
        var fieldContent = void 0;
        var nameKeyObj = (0, _utils.getNameIfNested)(name);
        if (this.getFieldMeta(nameKeyObj.name).exclusive) {
          name = nameKeyObj.name;
        }
        var field = this.getField(name);
        fieldContent = _extends({}, field, {
          value: value,
          dirty: (0, _utils.hasRules)(validate)
        });
        this.setFields(_defineProperty({}, name, fieldContent));
      },
      onChangeValidate: function onChangeValidate(name_, action) {
        var name = name_;
        var fieldMeta = this.getFieldMeta(name);

        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        if (fieldMeta[action]) {
          fieldMeta[action].apply(fieldMeta, args);
        } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
          var _fieldMeta$originalPr2;

          (_fieldMeta$originalPr2 = fieldMeta.originalProps)[action].apply(_fieldMeta$originalPr2, args);
        }
        var value = fieldMeta.getValueFromEvent ? fieldMeta.getValueFromEvent.apply(fieldMeta, args) : _utils.getValueFromEvent.apply(undefined, args);
        var nameKeyObj = (0, _utils.getNameIfNested)(name);
        if (this.getFieldMeta(nameKeyObj.name).exclusive) {
          name = nameKeyObj.name;
        }
        var field = this.getField(name);
        field.value = value;
        field.dirty = true;
        this.validateFieldsInternal([field], {
          action: action,
          options: {
            firstFields: !!fieldMeta.validateFirst
          }
        });
      },
      getCacheBind: function getCacheBind(name, action, fn) {
        var cache = this.cachedBind[name] = this.cachedBind[name] || {};
        if (!cache[action]) {
          cache[action] = fn.bind(this, name, action);
        }
        return cache[action];
      },
      getFieldMeta: function getFieldMeta(name) {
        return this.fieldsMeta[name];
      },
      getField: function getField(name) {
        var fields = this.fields;

        return _extends({}, fields[name], {
          name: name
        });
      },
      getFieldDecorator: function getFieldDecorator(name, fieldOption) {
        var _this = this;

        var props = this.getFieldProps(name, fieldOption);
        return function (fieldElem) {
          var fieldMeta = _this.getFieldMeta(name);
          var originalProps = fieldElem.props;
          if (process.env.NODE_ENV !== 'production') {
            var valuePropName = fieldMeta.valuePropName;
            (0, _warning2["default"])(!(valuePropName in originalProps), '`getFieldDecorator` will override `' + valuePropName + '`, ' + ('so please don\'t set `' + valuePropName + '` directly ') + 'and use `setFieldsValue` to set it.');
            var defaultValuePropName = 'default' + valuePropName[0].toUpperCase() + valuePropName.slice(1);
            (0, _warning2["default"])(!(defaultValuePropName in originalProps), '`' + defaultValuePropName + '` is invalid ' + ('for `getFieldDecorator` will set `' + valuePropName + '`,') + ' please use `option.initialValue` instead.');
          }
          fieldMeta.originalProps = originalProps;
          fieldMeta.ref = fieldElem.ref;
          return _react2["default"].cloneElement(fieldElem, _extends({}, props, _this.getFieldValuePropValue(fieldMeta)));
        };
      },
      getFieldProps: function getFieldProps(name) {
        var _this2 = this;

        var fieldOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!name) {
          throw new Error('Must call `getFieldProps` with valid name string!');
        }

        fieldOption.valuePropName = fieldOption.valuePropName || 'value';
        fieldOption.validate = fieldOption.validate || [];

        var rules = fieldOption.rules,
            _fieldOption$trigger = fieldOption.trigger,
            trigger = _fieldOption$trigger === undefined ? DEFAULT_TRIGGER : _fieldOption$trigger,
            exclusive = fieldOption.exclusive,
            _fieldOption$validate = fieldOption.validateTrigger,
            validateTrigger = _fieldOption$validate === undefined ? DEFAULT_VALIDATE_TRIGGER : _fieldOption$validate,
            validate = fieldOption.validate;


        fieldOption.trigger = trigger;
        fieldOption.validateTrigger = validateTrigger;

        var nameIfNested = (0, _utils.getNameIfNested)(name);
        var leadingName = nameIfNested.name;

        fieldOption.leadingName = leadingName;
        fieldOption.name = name;

        var fieldsMeta = this.fieldsMeta;

        var fieldMeta = void 0;
        var leadingFieldMeta = fieldsMeta[leadingName];

        if (nameIfNested.isNested) {
          leadingFieldMeta = fieldsMeta[leadingName] = fieldsMeta[leadingName] || {};
          leadingFieldMeta.virtual = !exclusive;
          // exclusive allow getFieldProps('x', {initialValue})
          // non-exclusive does not allow getFieldProps('x', {initialValue})
          leadingFieldMeta.hidden = !exclusive;
          leadingFieldMeta.exclusive = exclusive;
          fieldMeta = fieldsMeta[name] = fieldsMeta[name] || {};
        } else {
          fieldMeta = fieldsMeta[name] = fieldsMeta[name] || {};
        }

        if ('initialValue' in fieldOption) {
          fieldMeta.initialValue = fieldOption.initialValue;
        }

        var inputProps = {};

        if (fieldNameProp) {
          inputProps[fieldNameProp] = name;
        }

        var validateRules = validate.map(function (item) {
          var newItem = _extends({}, item, {
            trigger: item.trigger || []
          });
          if (typeof newItem.trigger === 'string') {
            newItem.trigger = [newItem.trigger];
          }
          return newItem;
        });

        if (rules) {
          validateRules.push({
            trigger: validateTrigger ? [].concat(validateTrigger) : [],
            rules: rules
          });
        }

        validateRules.filter(function (item) {
          return !!item.rules && item.rules.length;
        }).map(function (item) {
          return item.trigger;
        }).reduce(function (pre, curr) {
          return pre.concat(curr);
        }, []).forEach(function (action) {
          inputProps[action] = _this2.getCacheBind(name, action, _this2.onChangeValidate);
        });

        function checkRule(item) {
          return item.trigger.indexOf(trigger) === -1 || !item.rules || !item.rules.length;
        }

        if (trigger && validateRules.every(checkRule)) {
          inputProps[trigger] = this.getCacheBind(name, trigger, this.onChange);
        }

        inputProps = _extends({}, inputProps, this.getFieldValuePropValue(fieldOption));

        inputProps.ref = this.getCacheBind(name, name + '__ref', this.saveRef);

        var meta = _extends({}, fieldMeta, fieldOption, {
          validate: validateRules
        });

        fieldsMeta[name] = meta;

        if (fieldMetaProp) {
          inputProps[fieldMetaProp] = meta;
        }

        return inputProps;
      },
      getFieldValuePropValue: function getFieldValuePropValue(fieldMeta) {
        var exclusive = fieldMeta.exclusive,
            leadingName = fieldMeta.leadingName,
            name = fieldMeta.name,
            getValueProps = fieldMeta.getValueProps,
            valuePropName = fieldMeta.valuePropName;
        var fieldsMeta = this.fieldsMeta;

        var field = exclusive ? this.getField(leadingName) : this.getField(name);
        var fieldValue = atom;
        if (field && 'value' in field) {
          fieldValue = field.value;
        }
        if (fieldValue === atom) {
          fieldValue = exclusive ? fieldsMeta[leadingName].initialValue : fieldMeta.initialValue;
        }
        if (getValueProps) {
          return getValueProps(fieldValue);
        }
        return _defineProperty({}, valuePropName, fieldValue);
      },
      getFieldMember: function getFieldMember(name, member) {
        var field = this.getField(name);
        return field && field[member];
      },
      getFieldError: function getFieldError(name) {
        return (0, _utils.getErrorStrs)(this.getFieldMember(name, 'errors'));
      },
      getValidFieldsName: function getValidFieldsName() {
        var fieldsMeta = this.fieldsMeta;
        return fieldsMeta ? Object.keys(fieldsMeta).filter(function (name) {
          return !fieldsMeta[name].hidden;
        }) : [];
      },
      getFieldsValue: function getFieldsValue(names) {
        var _this3 = this;

        var fields = names || (0, _utils.flatFieldNames)(this.getValidFieldsName());
        var allValues = {};
        fields.forEach(function (f) {
          (0, _lodash6["default"])(allValues, f, _this3.getFieldValue(f));
        });
        return allValues;
      },
      getFieldValue: function getFieldValue(name) {
        var fields = this.fields;

        return this.getValueFromFields(name, fields);
      },
      getFieldInstance: function getFieldInstance(name) {
        return this.instances[name];
      },
      getValueFromFieldsInternal: function getValueFromFieldsInternal(name, fields) {
        var field = fields[name];
        if (field && 'value' in field) {
          return field.value;
        }
        var fieldMeta = this.fieldsMeta[name];
        return fieldMeta && fieldMeta.initialValue;
      },
      getValueFromFields: function getValueFromFields(name, fields) {
        var fieldsMeta = this.fieldsMeta;

        if (fieldsMeta[name] && fieldsMeta[name].virtual) {
          var ret = {};
          for (var fieldKey in fieldsMeta) {
            if (fieldsMeta.hasOwnProperty(fieldKey)) {
              var nameIfNested = (0, _utils.getNameIfNested)(fieldKey);
              if (nameIfNested.name === name && nameIfNested.isNested) {
                (0, _lodash6["default"])(ret, fieldKey, this.getValueFromFieldsInternal(fieldKey, fields));
              }
            }
          }
          return ret[name];
        }
        return this.getValueFromFieldsInternal(name, fields);
      },
      getRules: function getRules(fieldMeta, action) {
        var actionRules = fieldMeta.validate.filter(function (item) {
          return !action || item.trigger.indexOf(action) >= 0;
        }).map(function (item) {
          return item.rules;
        });
        return (0, _utils.flattenArray)(actionRules);
      },
      setFields: function setFields(fields_) {
        var _this4 = this;

        var fieldsMeta = this.fieldsMeta;
        var fields = fields_;
        var nowFields = _extends({}, this.fields, fields);
        var nowValues = {};
        Object.keys(fieldsMeta).forEach(function (f) {
          var _getNameIfNested = (0, _utils.getNameIfNested)(f),
              name = _getNameIfNested.name,
              isNested = _getNameIfNested.isNested;

          if (isNested && fieldsMeta[name].exclusive) {
            return;
          }
          nowValues[f] = _this4.getValueFromFields(f, nowFields);
        });
        var changedFieldsName = Object.keys(fields);
        Object.keys(nowValues).forEach(function (f) {
          var value = nowValues[f];
          var fieldMeta = fieldsMeta[f];
          if (fieldMeta && fieldMeta.normalize) {
            var nowValue = fieldMeta.normalize(value, _this4.getValueFromFields(f, _this4.fields), nowValues);
            if (nowValue !== value) {
              nowFields[f] = _extends({}, nowFields[f], {
                value: nowValue
              });
            }
          }
        });
        this.fields = nowFields;
        if (onFieldsChange) {
          (function () {
            var changedFields = {};
            changedFieldsName.forEach(function (f) {
              changedFields[f] = _this4.getField(f);
            });
            onFieldsChange(_this4.props, changedFields);
          })();
        }
        this.forceUpdate();
      },
      setFieldsValue: function setFieldsValue(fieldsValue) {
        var newFields = {};
        var fieldsMeta = this.fieldsMeta,
            fields = this.fields;

        var virtualPaths = (0, _utils.getVirtualPaths)(fieldsMeta);
        for (var name in fieldsValue) {
          if (fieldsValue.hasOwnProperty(name)) {
            var value = fieldsValue[name];
            if (fieldsMeta[name] && fieldsMeta[name].virtual) {
              (0, _utils.clearVirtualField)(name, fields, fieldsMeta);
              for (var i = 0, len = virtualPaths[name].length; i < len; i++) {
                var path = virtualPaths[name][i];
                if ((0, _lodash4["default"])(fieldsValue, path)) {
                  newFields[path] = {
                    name: path,
                    value: (0, _lodash2["default"])(fieldsValue, path)
                  };
                }
              }
            } else if (fieldsMeta[name]) {
              newFields[name] = {
                name: name,
                value: value
              };
            }
          }
        }
        this.setFields(newFields);
      },
      setFieldsInitialValue: function setFieldsInitialValue(initialValues) {
        var fieldsMeta = this.fieldsMeta;
        var virtualPaths = (0, _utils.getVirtualPaths)(fieldsMeta);
        for (var name in initialValues) {
          if (initialValues.hasOwnProperty(name)) {
            if (fieldsMeta[name] && fieldsMeta[name].virtual) {
              for (var i = 0, len = virtualPaths[name].length; i < len; i++) {
                var path = virtualPaths[name][i];
                if ((0, _lodash4["default"])(initialValues, path)) {
                  fieldsMeta[path] = _extends({}, fieldsMeta[path], {
                    initialValue: (0, _lodash2["default"])(initialValues, path)
                  });
                }
              }
            } else if (fieldsMeta[name]) {
              fieldsMeta[name] = _extends({}, fieldsMeta[name], {
                initialValue: initialValues[name]
              });
            }
          }
        }
      },
      saveRef: function saveRef(name, _, component) {
        if (!component) {
          // after destroy, delete data
          delete this.fieldsMeta[name];
          delete this.fields[name];
          delete this.instances[name];
          delete this.cachedBind[name];
          return;
        }
        var fieldMeta = this.getFieldMeta(name);
        if (fieldMeta) {
          var ref = fieldMeta.ref;
          if (ref) {
            if (typeof ref === 'string') {
              throw new Error('can not set ref string for ' + name);
            }
            ref(component);
          }
        }
        this.instances[name] = component;
      },
      validateFieldsInternal: function validateFieldsInternal(fields, _ref2, callback) {
        var _this5 = this;

        var fieldNames = _ref2.fieldNames,
            action = _ref2.action,
            _ref2$options = _ref2.options,
            options = _ref2$options === undefined ? {} : _ref2$options;

        var allRules = {};
        var allValues = {};
        var allFields = {};
        var alreadyErrors = {};
        fields.forEach(function (field) {
          var name = field.name;
          if (options.force !== true && field.dirty === false) {
            if (field.errors) {
              (0, _lodash6["default"])(alreadyErrors, name, { errors: field.errors });
            }
            return;
          }
          var fieldMeta = _this5.getFieldMeta(name);
          var newField = _extends({}, field);
          newField.errors = undefined;
          newField.validating = true;
          newField.dirty = true;
          allRules[name] = _this5.getRules(fieldMeta, action);
          allValues[name] = newField.value;
          allFields[name] = newField;
        });
        this.setFields(allFields);
        // in case normalize
        Object.keys(allValues).forEach(function (f) {
          allValues[f] = _this5.getFieldValue(f);
        });
        if (callback && (0, _utils.isEmptyObject)(allFields)) {
          callback((0, _utils.isEmptyObject)(alreadyErrors) ? null : alreadyErrors, this.getFieldsValue((0, _utils.flatFieldNames)(fieldNames)));
          return;
        }
        var validator = new _asyncValidator2["default"](allRules);
        if (validateMessages) {
          validator.messages(validateMessages);
        }
        validator.validate(allValues, options, function (errors) {
          var errorsGroup = _extends({}, alreadyErrors);
          var showErrorsGroup = {};
          if (errors && errors.length) {
            errors.forEach(function (e) {
              var fieldName = e.field;
              if (!(0, _lodash4["default"])(errorsGroup, fieldName)) {
                (0, _lodash6["default"])(errorsGroup, fieldName, { errors: [] });
                showErrorsGroup[fieldName] = { errors: [] };
              }
              var fieldErrors = (0, _lodash2["default"])(errorsGroup, fieldName.concat('.errors'));
              fieldErrors.push(e);
              showErrorsGroup[fieldName].errors.push(e);
            });
          }
          var expired = [];
          var nowAllFields = {};
          Object.keys(allRules).forEach(function (name) {
            var fieldErrors = (0, _lodash2["default"])(errorsGroup, name);
            var nowField = _this5.getField(name);
            // avoid concurrency problems
            if (nowField.value !== allValues[name]) {
              expired.push({
                name: name
              });
            } else {
              nowField.errors = fieldErrors && fieldErrors.errors;
              nowField.value = allValues[name];
              nowField.validating = false;
              nowField.dirty = false;
              nowAllFields[name] = nowField;
            }
          });
          _this5.setFields(nowAllFields);
          if (callback) {
            if (expired.length) {
              expired.forEach(function (_ref3) {
                var name = _ref3.name;

                var fieldErrors = [{
                  message: name + ' need to revalidate',
                  field: name
                }];
                (0, _lodash6["default"])(errorsGroup, name, {
                  expired: true,
                  errors: fieldErrors
                });
                showErrorsGroup[name] = {
                  expired: true,
                  errors: fieldErrors
                };
              });
            }

            callback((0, _utils.isEmptyObject)(showErrorsGroup) ? null : showErrorsGroup, _this5.getFieldsValue((0, _utils.flatFieldNames)(fieldNames)));
          }
        });
      },
      validateFields: function validateFields(ns, opt, cb) {
        var _this6 = this;

        var _getParams = (0, _utils.getParams)(ns, opt, cb),
            names = _getParams.names,
            callback = _getParams.callback,
            options = _getParams.options;

        var fieldNames = names || this.getValidFieldsName();
        var fields = fieldNames.map(function (name) {
          var fieldMeta = _this6.getFieldMeta(name);
          if (!(0, _utils.hasRules)(fieldMeta.validate)) {
            return null;
          }
          var field = _this6.getField(name);
          field.value = _this6.getFieldValue(name);
          return field;
        }).filter(function (f) {
          return !!f;
        });
        if (!fields.length) {
          if (callback) {
            callback(null, this.getFieldsValue((0, _utils.flatFieldNames)(fieldNames)));
          }
          return;
        }
        if (!('firstFields' in options)) {
          options.firstFields = fieldNames.filter(function (name) {
            var fieldMeta = _this6.getFieldMeta(name);
            return !!fieldMeta.validateFirst;
          });
        }
        this.validateFieldsInternal(fields, {
          fieldNames: fieldNames,
          options: options
        }, callback);
      },
      isFieldValidating: function isFieldValidating(name) {
        return this.getFieldMember(name, 'validating');
      },
      isFieldsValidating: function isFieldsValidating(ns) {
        var _this7 = this;

        var names = ns || this.getValidFieldsName();
        return names.some(function (n) {
          return _this7.isFieldValidating(n);
        });
      },
      isSubmitting: function isSubmitting() {
        return this.state.submitting;
      },
      submit: function submit(callback) {
        var _this8 = this;

        var fn = function fn() {
          _this8.setState({
            submitting: false
          });
        };
        this.setState({
          submitting: true
        });
        callback(fn);
      },
      resetFields: function resetFields(ns) {
        var newFields = {};
        var fields = this.fields;

        var changed = false;
        var names = ns || Object.keys(fields);
        names.forEach(function (name) {
          var field = fields[name];
          if (field && 'value' in field) {
            changed = true;
            newFields[name] = {};
          }
        });
        if (changed) {
          this.setFields(newFields);
        }
      },
      render: function render() {
        var formProps = _defineProperty({}, formPropName, this.getForm());
        if (withRef) {
          formProps.ref = 'wrappedComponent';
        }
        var props = mapProps.call(this, _extends({}, formProps, this.props));
        return _react2["default"].createElement(WrappedComponent, props);
      }
    });

    return (0, _utils.argumentContainer)(Form, WrappedComponent, option);
  }

  return decorate;
}

exports["default"] = createBaseForm;
module.exports = exports['default'];