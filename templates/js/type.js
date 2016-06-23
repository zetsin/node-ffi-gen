var libclang = require('libclang-bootstrap')
var Type = libclang.Type

module.exports = function (type) {
  if (type == Type.Void) {
    return {
      name: 'voit',
      type: 'ref.types.void'
    }
  }
  else if (type == Type.Bool) {
    return {
      name: 'byte',
      type: 'ref.types.byte'
    }
  }
  else if (type == Type.Char_U) {
    return {
      name: 'uchar',
      type: 'ref.types.uchar'
    }
  }
  else if (type == Type.UChar) {
    return {
      name: 'uchar',
      type: 'ref.types.uchar'
    }
  }
  else if (type == Type.UShort) {
    return {
      name: 'ushort',
      type: 'ref.types.ushort'
    }
  }
  else if (type == Type.UInt) {
    return {
      name: 'uint32',
      type: 'ref.types.uint32'
    }
  }
  else if (type == Type.ULong) {
    return {
      name: 'ulong',
      type: 'ref.types.ulong'
    }
  }
  else if (type == Type.ULongLong) {
    return {
      name: 'ulonglong',
      type: 'ref.types.ulonglong'
    }
  }
  else if (type == Type.Char_S) {
    return {
      name: 'char',
      type: 'ref.types.char'
    }
  }
  else if (type == Type.SChar) {
    return {
      name: 'char',
      type: 'ref.types.char'
    }
  }
  else if (type == Type.Short) {
    return {
      name: 'short',
      type: 'ref.types.short'
    }
  }
  else if (type == Type.Int) {
    return {
      name: 'int32',
      type: 'ref.types.int32'
    }
  }
  else if (type == Type.Long) {
    return {
      name: 'long',
      type: 'ref.types.long'
    }
  }
  else if (type == Type.LongLong) {
    return {
      name: 'longlong',
      type: 'ref.types.longlong'
    }
  }
  else if (type == Type.Float) {
    return {
      name: 'float',
      type: 'ref.types.float'
    }
  }
  else if (type == Type.Double) {
    return {
      name: 'double',
      type: 'ref.types.double'
    }
  } else if (type == 'string') {
    return {
      name: 'string',
      type: 'ref.types.CString'
    }
  }
}