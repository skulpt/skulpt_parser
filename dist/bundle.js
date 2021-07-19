var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i = decorators.length - 1, decorator; i >= 0; i--)
        if ((decorator = decorators[i]))
            result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
};

// src/util/unicode.ts
var Ll =
    "a-z\\xB5\\xDF-\\xF6\\xF8-\\xFF\\u0101\\u0103\\u0105\\u0107\\u0109\\u010B\\u010D\\u010F\\u0111\\u0113\\u0115\\u0117\\u0119\\u011B\\u011D\\u011F\\u0121\\u0123\\u0125\\u0127\\u0129\\u012B\\u012D\\u012F\\u0131\\u0133\\u0135\\u0137\\u0138\\u013A\\u013C\\u013E\\u0140\\u0142\\u0144\\u0146\\u0148\\u0149\\u014B\\u014D\\u014F\\u0151\\u0153\\u0155\\u0157\\u0159\\u015B\\u015D\\u015F\\u0161\\u0163\\u0165\\u0167\\u0169\\u016B\\u016D\\u016F\\u0171\\u0173\\u0175\\u0177\\u017A\\u017C\\u017E-\\u0180\\u0183\\u0185\\u0188\\u018C\\u018D\\u0192\\u0195\\u0199-\\u019B\\u019E\\u01A1\\u01A3\\u01A5\\u01A8\\u01AA\\u01AB\\u01AD\\u01B0\\u01B4\\u01B6\\u01B9\\u01BA\\u01BD-\\u01BF\\u01C6\\u01C9\\u01CC\\u01CE\\u01D0\\u01D2\\u01D4\\u01D6\\u01D8\\u01DA\\u01DC\\u01DD\\u01DF\\u01E1\\u01E3\\u01E5\\u01E7\\u01E9\\u01EB\\u01ED\\u01EF\\u01F0\\u01F3\\u01F5\\u01F9\\u01FB\\u01FD\\u01FF\\u0201\\u0203\\u0205\\u0207\\u0209\\u020B\\u020D\\u020F\\u0211\\u0213\\u0215\\u0217\\u0219\\u021B\\u021D\\u021F\\u0221\\u0223\\u0225\\u0227\\u0229\\u022B\\u022D\\u022F\\u0231\\u0233-\\u0239\\u023C\\u023F\\u0240\\u0242\\u0247\\u0249\\u024B\\u024D\\u024F-\\u0293\\u0295-\\u02AF\\u0371\\u0373\\u0377\\u037B-\\u037D\\u0390\\u03AC-\\u03CE\\u03D0\\u03D1\\u03D5-\\u03D7\\u03D9\\u03DB\\u03DD\\u03DF\\u03E1\\u03E3\\u03E5\\u03E7\\u03E9\\u03EB\\u03ED\\u03EF-\\u03F3\\u03F5\\u03F8\\u03FB\\u03FC\\u0430-\\u045F\\u0461\\u0463\\u0465\\u0467\\u0469\\u046B\\u046D\\u046F\\u0471\\u0473\\u0475\\u0477\\u0479\\u047B\\u047D\\u047F\\u0481\\u048B\\u048D\\u048F\\u0491\\u0493\\u0495\\u0497\\u0499\\u049B\\u049D\\u049F\\u04A1\\u04A3\\u04A5\\u04A7\\u04A9\\u04AB\\u04AD\\u04AF\\u04B1\\u04B3\\u04B5\\u04B7\\u04B9\\u04BB\\u04BD\\u04BF\\u04C2\\u04C4\\u04C6\\u04C8\\u04CA\\u04CC\\u04CE\\u04CF\\u04D1\\u04D3\\u04D5\\u04D7\\u04D9\\u04DB\\u04DD\\u04DF\\u04E1\\u04E3\\u04E5\\u04E7\\u04E9\\u04EB\\u04ED\\u04EF\\u04F1\\u04F3\\u04F5\\u04F7\\u04F9\\u04FB\\u04FD\\u04FF\\u0501\\u0503\\u0505\\u0507\\u0509\\u050B\\u050D\\u050F\\u0511\\u0513\\u0515\\u0517\\u0519\\u051B\\u051D\\u051F\\u0521\\u0523\\u0525\\u0527\\u0529\\u052B\\u052D\\u052F\\u0560-\\u0588\\u10D0-\\u10FA\\u10FD-\\u10FF\\u13F8-\\u13FD\\u1C80-\\u1C88\\u1D00-\\u1D2B\\u1D6B-\\u1D77\\u1D79-\\u1D9A\\u1E01\\u1E03\\u1E05\\u1E07\\u1E09\\u1E0B\\u1E0D\\u1E0F\\u1E11\\u1E13\\u1E15\\u1E17\\u1E19\\u1E1B\\u1E1D\\u1E1F\\u1E21\\u1E23\\u1E25\\u1E27\\u1E29\\u1E2B\\u1E2D\\u1E2F\\u1E31\\u1E33\\u1E35\\u1E37\\u1E39\\u1E3B\\u1E3D\\u1E3F\\u1E41\\u1E43\\u1E45\\u1E47\\u1E49\\u1E4B\\u1E4D\\u1E4F\\u1E51\\u1E53\\u1E55\\u1E57\\u1E59\\u1E5B\\u1E5D\\u1E5F\\u1E61\\u1E63\\u1E65\\u1E67\\u1E69\\u1E6B\\u1E6D\\u1E6F\\u1E71\\u1E73\\u1E75\\u1E77\\u1E79\\u1E7B\\u1E7D\\u1E7F\\u1E81\\u1E83\\u1E85\\u1E87\\u1E89\\u1E8B\\u1E8D\\u1E8F\\u1E91\\u1E93\\u1E95-\\u1E9D\\u1E9F\\u1EA1\\u1EA3\\u1EA5\\u1EA7\\u1EA9\\u1EAB\\u1EAD\\u1EAF\\u1EB1\\u1EB3\\u1EB5\\u1EB7\\u1EB9\\u1EBB\\u1EBD\\u1EBF\\u1EC1\\u1EC3\\u1EC5\\u1EC7\\u1EC9\\u1ECB\\u1ECD\\u1ECF\\u1ED1\\u1ED3\\u1ED5\\u1ED7\\u1ED9\\u1EDB\\u1EDD\\u1EDF\\u1EE1\\u1EE3\\u1EE5\\u1EE7\\u1EE9\\u1EEB\\u1EED\\u1EEF\\u1EF1\\u1EF3\\u1EF5\\u1EF7\\u1EF9\\u1EFB\\u1EFD\\u1EFF-\\u1F07\\u1F10-\\u1F15\\u1F20-\\u1F27\\u1F30-\\u1F37\\u1F40-\\u1F45\\u1F50-\\u1F57\\u1F60-\\u1F67\\u1F70-\\u1F7D\\u1F80-\\u1F87\\u1F90-\\u1F97\\u1FA0-\\u1FA7\\u1FB0-\\u1FB4\\u1FB6\\u1FB7\\u1FBE\\u1FC2-\\u1FC4\\u1FC6\\u1FC7\\u1FD0-\\u1FD3\\u1FD6\\u1FD7\\u1FE0-\\u1FE7\\u1FF2-\\u1FF4\\u1FF6\\u1FF7\\u210A\\u210E\\u210F\\u2113\\u212F\\u2134\\u2139\\u213C\\u213D\\u2146-\\u2149\\u214E\\u2184\\u2C30-\\u2C5E\\u2C61\\u2C65\\u2C66\\u2C68\\u2C6A\\u2C6C\\u2C71\\u2C73\\u2C74\\u2C76-\\u2C7B\\u2C81\\u2C83\\u2C85\\u2C87\\u2C89\\u2C8B\\u2C8D\\u2C8F\\u2C91\\u2C93\\u2C95\\u2C97\\u2C99\\u2C9B\\u2C9D\\u2C9F\\u2CA1\\u2CA3\\u2CA5\\u2CA7\\u2CA9\\u2CAB\\u2CAD\\u2CAF\\u2CB1\\u2CB3\\u2CB5\\u2CB7\\u2CB9\\u2CBB\\u2CBD\\u2CBF\\u2CC1\\u2CC3\\u2CC5\\u2CC7\\u2CC9\\u2CCB\\u2CCD\\u2CCF\\u2CD1\\u2CD3\\u2CD5\\u2CD7\\u2CD9\\u2CDB\\u2CDD\\u2CDF\\u2CE1\\u2CE3\\u2CE4\\u2CEC\\u2CEE\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\uA641\\uA643\\uA645\\uA647\\uA649\\uA64B\\uA64D\\uA64F\\uA651\\uA653\\uA655\\uA657\\uA659\\uA65B\\uA65D\\uA65F\\uA661\\uA663\\uA665\\uA667\\uA669\\uA66B\\uA66D\\uA681\\uA683\\uA685\\uA687\\uA689\\uA68B\\uA68D\\uA68F\\uA691\\uA693\\uA695\\uA697\\uA699\\uA69B\\uA723\\uA725\\uA727\\uA729\\uA72B\\uA72D\\uA72F-\\uA731\\uA733\\uA735\\uA737\\uA739\\uA73B\\uA73D\\uA73F\\uA741\\uA743\\uA745\\uA747\\uA749\\uA74B\\uA74D\\uA74F\\uA751\\uA753\\uA755\\uA757\\uA759\\uA75B\\uA75D\\uA75F\\uA761\\uA763\\uA765\\uA767\\uA769\\uA76B\\uA76D\\uA76F\\uA771-\\uA778\\uA77A\\uA77C\\uA77F\\uA781\\uA783\\uA785\\uA787\\uA78C\\uA78E\\uA791\\uA793-\\uA795\\uA797\\uA799\\uA79B\\uA79D\\uA79F\\uA7A1\\uA7A3\\uA7A5\\uA7A7\\uA7A9\\uA7AF\\uA7B5\\uA7B7\\uA7B9\\uA7BB\\uA7BD\\uA7BF\\uA7C3\\uA7C8\\uA7CA\\uA7F6\\uA7FA\\uAB30-\\uAB5A\\uAB60-\\uAB68\\uAB70-\\uABBF\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFF41-\\uFF5A";
var Lm =
    "\\u02B0-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0374\\u037A\\u0559\\u0640\\u06E5\\u06E6\\u07F4\\u07F5\\u07FA\\u081A\\u0824\\u0828\\u0971\\u0E46\\u0EC6\\u10FC\\u17D7\\u1843\\u1AA7\\u1C78-\\u1C7D\\u1D2C-\\u1D6A\\u1D78\\u1D9B-\\u1DBF\\u2071\\u207F\\u2090-\\u209C\\u2C7C\\u2C7D\\u2D6F\\u2E2F\\u3005\\u3031-\\u3035\\u303B\\u309D\\u309E\\u30FC-\\u30FE\\uA015\\uA4F8-\\uA4FD\\uA60C\\uA67F\\uA69C\\uA69D\\uA717-\\uA71F\\uA770\\uA788\\uA7F8\\uA7F9\\uA9CF\\uA9E6\\uAA70\\uAADD\\uAAF3\\uAAF4\\uAB5C-\\uAB5F\\uAB69\\uFF70\\uFF9E\\uFF9F";
var Lo =
    "\\xAA\\xBA\\u01BB\\u01C0-\\u01C3\\u0294\\u05D0-\\u05EA\\u05EF-\\u05F2\\u0620-\\u063F\\u0641-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u0800-\\u0815\\u0840-\\u0858\\u0860-\\u086A\\u08A0-\\u08B4\\u08B6-\\u08C7\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0972-\\u0980\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u09FC\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0AF9\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C39\\u0C3D\\u0C58-\\u0C5A\\u0C60\\u0C61\\u0C80\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D04-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D54-\\u0D56\\u0D5F-\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E45\\u0E81\\u0E82\\u0E84\\u0E86-\\u0E8A\\u0E8C-\\u0EA3\\u0EA5\\u0EA7-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u1100-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16F1-\\u16F8\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17DC\\u1820-\\u1842\\u1844-\\u1878\\u1880-\\u1884\\u1887-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191E\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19B0-\\u19C9\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C77\\u1CE9-\\u1CEC\\u1CEE-\\u1CF3\\u1CF5\\u1CF6\\u1CFA\\u2135-\\u2138\\u2D30-\\u2D67\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u3006\\u303C\\u3041-\\u3096\\u309F\\u30A1-\\u30FA\\u30FF\\u3105-\\u312F\\u3131-\\u318E\\u31A0-\\u31BF\\u31F0-\\u31FF\\u3400-\\u4DBF\\u4E00-\\u9FFC\\uA000-\\uA014\\uA016-\\uA48C\\uA4D0-\\uA4F7\\uA500-\\uA60B\\uA610-\\uA61F\\uA62A\\uA62B\\uA66E\\uA6A0-\\uA6E5\\uA78F\\uA7F7\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA8FD\\uA8FE\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9E0-\\uA9E4\\uA9E7-\\uA9EF\\uA9FA-\\uA9FE\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA6F\\uAA71-\\uAA76\\uAA7A\\uAA7E-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB\\uAADC\\uAAE0-\\uAAEA\\uAAF2\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF66-\\uFF6F\\uFF71-\\uFF9D\\uFFA0-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC";
var Lt = "\\u01C5\\u01C8\\u01CB\\u01F2\\u1F88-\\u1F8F\\u1F98-\\u1F9F\\u1FA8-\\u1FAF\\u1FBC\\u1FCC\\u1FFC";
var Lu =
    "A-Z\\xC0-\\xD6\\xD8-\\xDE\\u0100\\u0102\\u0104\\u0106\\u0108\\u010A\\u010C\\u010E\\u0110\\u0112\\u0114\\u0116\\u0118\\u011A\\u011C\\u011E\\u0120\\u0122\\u0124\\u0126\\u0128\\u012A\\u012C\\u012E\\u0130\\u0132\\u0134\\u0136\\u0139\\u013B\\u013D\\u013F\\u0141\\u0143\\u0145\\u0147\\u014A\\u014C\\u014E\\u0150\\u0152\\u0154\\u0156\\u0158\\u015A\\u015C\\u015E\\u0160\\u0162\\u0164\\u0166\\u0168\\u016A\\u016C\\u016E\\u0170\\u0172\\u0174\\u0176\\u0178\\u0179\\u017B\\u017D\\u0181\\u0182\\u0184\\u0186\\u0187\\u0189-\\u018B\\u018E-\\u0191\\u0193\\u0194\\u0196-\\u0198\\u019C\\u019D\\u019F\\u01A0\\u01A2\\u01A4\\u01A6\\u01A7\\u01A9\\u01AC\\u01AE\\u01AF\\u01B1-\\u01B3\\u01B5\\u01B7\\u01B8\\u01BC\\u01C4\\u01C7\\u01CA\\u01CD\\u01CF\\u01D1\\u01D3\\u01D5\\u01D7\\u01D9\\u01DB\\u01DE\\u01E0\\u01E2\\u01E4\\u01E6\\u01E8\\u01EA\\u01EC\\u01EE\\u01F1\\u01F4\\u01F6-\\u01F8\\u01FA\\u01FC\\u01FE\\u0200\\u0202\\u0204\\u0206\\u0208\\u020A\\u020C\\u020E\\u0210\\u0212\\u0214\\u0216\\u0218\\u021A\\u021C\\u021E\\u0220\\u0222\\u0224\\u0226\\u0228\\u022A\\u022C\\u022E\\u0230\\u0232\\u023A\\u023B\\u023D\\u023E\\u0241\\u0243-\\u0246\\u0248\\u024A\\u024C\\u024E\\u0370\\u0372\\u0376\\u037F\\u0386\\u0388-\\u038A\\u038C\\u038E\\u038F\\u0391-\\u03A1\\u03A3-\\u03AB\\u03CF\\u03D2-\\u03D4\\u03D8\\u03DA\\u03DC\\u03DE\\u03E0\\u03E2\\u03E4\\u03E6\\u03E8\\u03EA\\u03EC\\u03EE\\u03F4\\u03F7\\u03F9\\u03FA\\u03FD-\\u042F\\u0460\\u0462\\u0464\\u0466\\u0468\\u046A\\u046C\\u046E\\u0470\\u0472\\u0474\\u0476\\u0478\\u047A\\u047C\\u047E\\u0480\\u048A\\u048C\\u048E\\u0490\\u0492\\u0494\\u0496\\u0498\\u049A\\u049C\\u049E\\u04A0\\u04A2\\u04A4\\u04A6\\u04A8\\u04AA\\u04AC\\u04AE\\u04B0\\u04B2\\u04B4\\u04B6\\u04B8\\u04BA\\u04BC\\u04BE\\u04C0\\u04C1\\u04C3\\u04C5\\u04C7\\u04C9\\u04CB\\u04CD\\u04D0\\u04D2\\u04D4\\u04D6\\u04D8\\u04DA\\u04DC\\u04DE\\u04E0\\u04E2\\u04E4\\u04E6\\u04E8\\u04EA\\u04EC\\u04EE\\u04F0\\u04F2\\u04F4\\u04F6\\u04F8\\u04FA\\u04FC\\u04FE\\u0500\\u0502\\u0504\\u0506\\u0508\\u050A\\u050C\\u050E\\u0510\\u0512\\u0514\\u0516\\u0518\\u051A\\u051C\\u051E\\u0520\\u0522\\u0524\\u0526\\u0528\\u052A\\u052C\\u052E\\u0531-\\u0556\\u10A0-\\u10C5\\u10C7\\u10CD\\u13A0-\\u13F5\\u1C90-\\u1CBA\\u1CBD-\\u1CBF\\u1E00\\u1E02\\u1E04\\u1E06\\u1E08\\u1E0A\\u1E0C\\u1E0E\\u1E10\\u1E12\\u1E14\\u1E16\\u1E18\\u1E1A\\u1E1C\\u1E1E\\u1E20\\u1E22\\u1E24\\u1E26\\u1E28\\u1E2A\\u1E2C\\u1E2E\\u1E30\\u1E32\\u1E34\\u1E36\\u1E38\\u1E3A\\u1E3C\\u1E3E\\u1E40\\u1E42\\u1E44\\u1E46\\u1E48\\u1E4A\\u1E4C\\u1E4E\\u1E50\\u1E52\\u1E54\\u1E56\\u1E58\\u1E5A\\u1E5C\\u1E5E\\u1E60\\u1E62\\u1E64\\u1E66\\u1E68\\u1E6A\\u1E6C\\u1E6E\\u1E70\\u1E72\\u1E74\\u1E76\\u1E78\\u1E7A\\u1E7C\\u1E7E\\u1E80\\u1E82\\u1E84\\u1E86\\u1E88\\u1E8A\\u1E8C\\u1E8E\\u1E90\\u1E92\\u1E94\\u1E9E\\u1EA0\\u1EA2\\u1EA4\\u1EA6\\u1EA8\\u1EAA\\u1EAC\\u1EAE\\u1EB0\\u1EB2\\u1EB4\\u1EB6\\u1EB8\\u1EBA\\u1EBC\\u1EBE\\u1EC0\\u1EC2\\u1EC4\\u1EC6\\u1EC8\\u1ECA\\u1ECC\\u1ECE\\u1ED0\\u1ED2\\u1ED4\\u1ED6\\u1ED8\\u1EDA\\u1EDC\\u1EDE\\u1EE0\\u1EE2\\u1EE4\\u1EE6\\u1EE8\\u1EEA\\u1EEC\\u1EEE\\u1EF0\\u1EF2\\u1EF4\\u1EF6\\u1EF8\\u1EFA\\u1EFC\\u1EFE\\u1F08-\\u1F0F\\u1F18-\\u1F1D\\u1F28-\\u1F2F\\u1F38-\\u1F3F\\u1F48-\\u1F4D\\u1F59\\u1F5B\\u1F5D\\u1F5F\\u1F68-\\u1F6F\\u1FB8-\\u1FBB\\u1FC8-\\u1FCB\\u1FD8-\\u1FDB\\u1FE8-\\u1FEC\\u1FF8-\\u1FFB\\u2102\\u2107\\u210B-\\u210D\\u2110-\\u2112\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u2130-\\u2133\\u213E\\u213F\\u2145\\u2183\\u2C00-\\u2C2E\\u2C60\\u2C62-\\u2C64\\u2C67\\u2C69\\u2C6B\\u2C6D-\\u2C70\\u2C72\\u2C75\\u2C7E-\\u2C80\\u2C82\\u2C84\\u2C86\\u2C88\\u2C8A\\u2C8C\\u2C8E\\u2C90\\u2C92\\u2C94\\u2C96\\u2C98\\u2C9A\\u2C9C\\u2C9E\\u2CA0\\u2CA2\\u2CA4\\u2CA6\\u2CA8\\u2CAA\\u2CAC\\u2CAE\\u2CB0\\u2CB2\\u2CB4\\u2CB6\\u2CB8\\u2CBA\\u2CBC\\u2CBE\\u2CC0\\u2CC2\\u2CC4\\u2CC6\\u2CC8\\u2CCA\\u2CCC\\u2CCE\\u2CD0\\u2CD2\\u2CD4\\u2CD6\\u2CD8\\u2CDA\\u2CDC\\u2CDE\\u2CE0\\u2CE2\\u2CEB\\u2CED\\u2CF2\\uA640\\uA642\\uA644\\uA646\\uA648\\uA64A\\uA64C\\uA64E\\uA650\\uA652\\uA654\\uA656\\uA658\\uA65A\\uA65C\\uA65E\\uA660\\uA662\\uA664\\uA666\\uA668\\uA66A\\uA66C\\uA680\\uA682\\uA684\\uA686\\uA688\\uA68A\\uA68C\\uA68E\\uA690\\uA692\\uA694\\uA696\\uA698\\uA69A\\uA722\\uA724\\uA726\\uA728\\uA72A\\uA72C\\uA72E\\uA732\\uA734\\uA736\\uA738\\uA73A\\uA73C\\uA73E\\uA740\\uA742\\uA744\\uA746\\uA748\\uA74A\\uA74C\\uA74E\\uA750\\uA752\\uA754\\uA756\\uA758\\uA75A\\uA75C\\uA75E\\uA760\\uA762\\uA764\\uA766\\uA768\\uA76A\\uA76C\\uA76E\\uA779\\uA77B\\uA77D\\uA77E\\uA780\\uA782\\uA784\\uA786\\uA78B\\uA78D\\uA790\\uA792\\uA796\\uA798\\uA79A\\uA79C\\uA79E\\uA7A0\\uA7A2\\uA7A4\\uA7A6\\uA7A8\\uA7AA-\\uA7AE\\uA7B0-\\uA7B4\\uA7B6\\uA7B8\\uA7BA\\uA7BC\\uA7BE\\uA7C2\\uA7C4-\\uA7C7\\uA7C9\\uA7F5\\uFF21-\\uFF3A";
var Mn =
    "\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u07FD\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0859-\\u085B\\u08D3-\\u08E1\\u08E3-\\u0902\\u093A\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0957\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u09FE\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0AFA-\\u0AFF\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B55\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C00\\u0C04\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0C81\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D00\\u0D01\\u0D3B\\u0D3C\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0D81\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F8D-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135D-\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B4\\u17B5\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u1885\\u1886\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A1B\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1AB0-\\u1ABD\\u1ABF\\u1AC0\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1BAB-\\u1BAD\\u1BE6\\u1BE8\\u1BE9\\u1BED\\u1BEF-\\u1BF1\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1CF4\\u1CF8\\u1CF9\\u1DC0-\\u1DF9\\u1DFB-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2D7F\\u2DE0-\\u2DFF\\u302A-\\u302D\\u3099\\u309A\\uA66F\\uA674-\\uA67D\\uA69E\\uA69F\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA82C\\uA8C4\\uA8C5\\uA8E0-\\uA8F1\\uA8FF\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uA9BD\\uA9E5\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAA7C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uAAEC\\uAAED\\uAAF6\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE2F";
var Nd =
    "0-9\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0DE6-\\u0DEF\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uA9F0-\\uA9F9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19";
var Nl = "\\u16EE-\\u16F0\\u2160-\\u2182\\u2185-\\u2188\\u3007\\u3021-\\u3029\\u3038-\\u303A\\uA6E6-\\uA6EF";
var No =
    "\\xB2\\xB3\\xB9\\xBC-\\xBE\\u09F4-\\u09F9\\u0B72-\\u0B77\\u0BF0-\\u0BF2\\u0C78-\\u0C7E\\u0D58-\\u0D5E\\u0D70-\\u0D78\\u0F2A-\\u0F33\\u1369-\\u137C\\u17F0-\\u17F9\\u19DA\\u2070\\u2074-\\u2079\\u2080-\\u2089\\u2150-\\u215F\\u2189\\u2460-\\u249B\\u24EA-\\u24FF\\u2776-\\u2793\\u2CFD\\u3192-\\u3195\\u3220-\\u3229\\u3248-\\u324F\\u3251-\\u325F\\u3280-\\u3289\\u32B1-\\u32BF\\uA830-\\uA835";
var L = Lu + Ll + Lt + Lm + Mn + Lo;
var N = Nd + Nl + No;
var w = "_" + L + N;

// src/util/str_helpers.ts
var the_underscore = "_";
var Other_ID_Start = "\\u1885-\\u1886\\u2118\\u212E\\u309B-\\u309C";
var id_start = Lu + Ll + Lt + Lm + Lo + Nl + the_underscore + Other_ID_Start;
var IS_SIMPLE_START = /^[A-Za-z_]$/;
var INVALID_START = /^[\\\/(){}\[\].!%&*=+,-><:;@^~]$/;
var IS_VALID_START = new RegExp("^[" + id_start + "]$");
function initialIsIdentifier(s) {
    return IS_SIMPLE_START.test(s) || (!INVALID_START.test(s) && IS_VALID_START.test(s.normalize("NFKC")));
}
var IS_SPACE = /^\s+$/;
function isSpace(s) {
    return IS_SPACE.test(s);
}

// src/tokenize/token.ts
var tokens;
(function (tokens2) {
    tokens2[(tokens2["ENDMARKER"] = 0)] = "ENDMARKER";
    tokens2[(tokens2["NAME"] = 1)] = "NAME";
    tokens2[(tokens2["NUMBER"] = 2)] = "NUMBER";
    tokens2[(tokens2["STRING"] = 3)] = "STRING";
    tokens2[(tokens2["NEWLINE"] = 4)] = "NEWLINE";
    tokens2[(tokens2["INDENT"] = 5)] = "INDENT";
    tokens2[(tokens2["DEDENT"] = 6)] = "DEDENT";
    tokens2[(tokens2["LPAR"] = 7)] = "LPAR";
    tokens2[(tokens2["RPAR"] = 8)] = "RPAR";
    tokens2[(tokens2["LSQB"] = 9)] = "LSQB";
    tokens2[(tokens2["RSQB"] = 10)] = "RSQB";
    tokens2[(tokens2["COLON"] = 11)] = "COLON";
    tokens2[(tokens2["COMMA"] = 12)] = "COMMA";
    tokens2[(tokens2["SEMI"] = 13)] = "SEMI";
    tokens2[(tokens2["PLUS"] = 14)] = "PLUS";
    tokens2[(tokens2["MINUS"] = 15)] = "MINUS";
    tokens2[(tokens2["STAR"] = 16)] = "STAR";
    tokens2[(tokens2["SLASH"] = 17)] = "SLASH";
    tokens2[(tokens2["VBAR"] = 18)] = "VBAR";
    tokens2[(tokens2["AMPER"] = 19)] = "AMPER";
    tokens2[(tokens2["LESS"] = 20)] = "LESS";
    tokens2[(tokens2["GREATER"] = 21)] = "GREATER";
    tokens2[(tokens2["EQUAL"] = 22)] = "EQUAL";
    tokens2[(tokens2["DOT"] = 23)] = "DOT";
    tokens2[(tokens2["PERCENT"] = 24)] = "PERCENT";
    tokens2[(tokens2["LBRACE"] = 25)] = "LBRACE";
    tokens2[(tokens2["RBRACE"] = 26)] = "RBRACE";
    tokens2[(tokens2["EQEQUAL"] = 27)] = "EQEQUAL";
    tokens2[(tokens2["NOTEQUAL"] = 28)] = "NOTEQUAL";
    tokens2[(tokens2["LESSEQUAL"] = 29)] = "LESSEQUAL";
    tokens2[(tokens2["GREATEREQUAL"] = 30)] = "GREATEREQUAL";
    tokens2[(tokens2["TILDE"] = 31)] = "TILDE";
    tokens2[(tokens2["CIRCUMFLEX"] = 32)] = "CIRCUMFLEX";
    tokens2[(tokens2["LEFTSHIFT"] = 33)] = "LEFTSHIFT";
    tokens2[(tokens2["RIGHTSHIFT"] = 34)] = "RIGHTSHIFT";
    tokens2[(tokens2["DOUBLESTAR"] = 35)] = "DOUBLESTAR";
    tokens2[(tokens2["PLUSEQUAL"] = 36)] = "PLUSEQUAL";
    tokens2[(tokens2["MINEQUAL"] = 37)] = "MINEQUAL";
    tokens2[(tokens2["STAREQUAL"] = 38)] = "STAREQUAL";
    tokens2[(tokens2["SLASHEQUAL"] = 39)] = "SLASHEQUAL";
    tokens2[(tokens2["PERCENTEQUAL"] = 40)] = "PERCENTEQUAL";
    tokens2[(tokens2["AMPEREQUAL"] = 41)] = "AMPEREQUAL";
    tokens2[(tokens2["VBAREQUAL"] = 42)] = "VBAREQUAL";
    tokens2[(tokens2["CIRCUMFLEXEQUAL"] = 43)] = "CIRCUMFLEXEQUAL";
    tokens2[(tokens2["LEFTSHIFTEQUAL"] = 44)] = "LEFTSHIFTEQUAL";
    tokens2[(tokens2["RIGHTSHIFTEQUAL"] = 45)] = "RIGHTSHIFTEQUAL";
    tokens2[(tokens2["DOUBLESTAREQUAL"] = 46)] = "DOUBLESTAREQUAL";
    tokens2[(tokens2["DOUBLESLASH"] = 47)] = "DOUBLESLASH";
    tokens2[(tokens2["DOUBLESLASHEQUAL"] = 48)] = "DOUBLESLASHEQUAL";
    tokens2[(tokens2["AT"] = 49)] = "AT";
    tokens2[(tokens2["ATEQUAL"] = 50)] = "ATEQUAL";
    tokens2[(tokens2["RARROW"] = 51)] = "RARROW";
    tokens2[(tokens2["ELLIPSIS"] = 52)] = "ELLIPSIS";
    tokens2[(tokens2["COLONEQUAL"] = 53)] = "COLONEQUAL";
    tokens2[(tokens2["OP"] = 54)] = "OP";
    tokens2[(tokens2["AWAIT"] = 55)] = "AWAIT";
    tokens2[(tokens2["ASYNC"] = 56)] = "ASYNC";
    tokens2[(tokens2["TYPE_IGNORE"] = 57)] = "TYPE_IGNORE";
    tokens2[(tokens2["TYPE_COMMENT"] = 58)] = "TYPE_COMMENT";
    tokens2[(tokens2["ERRORTOKEN"] = 59)] = "ERRORTOKEN";
    tokens2[(tokens2["COMMENT"] = 60)] = "COMMENT";
    tokens2[(tokens2["NL"] = 61)] = "NL";
    tokens2[(tokens2["ENCODING"] = 62)] = "ENCODING";
    tokens2[(tokens2["N_TOKENS"] = 63)] = "N_TOKENS";
})(tokens || (tokens = {}));
var ENDMARKER = 0;
var NAME = 1;
var NUMBER = 2;
var STRING = 3;
var NEWLINE = 4;
var INDENT = 5;
var DEDENT = 6;
var DOT = 23;
var ELLIPSIS = 52;
var ERRORTOKEN = 59;
var COMMENT = 60;
var NL = 61;
var EXACT_TOKEN_TYPES = new Map([
    ["!=", 28],
    ["%", 24],
    ["%=", 40],
    ["&", 19],
    ["&=", 41],
    ["(", 7],
    [")", 8],
    ["*", 16],
    ["**", 35],
    ["**=", 46],
    ["*=", 38],
    ["+", 14],
    ["+=", 36],
    [",", 12],
    ["-", 15],
    ["-=", 37],
    ["->", 51],
    [".", 23],
    ["...", 52],
    ["/", 17],
    ["//", 47],
    ["//=", 48],
    ["/=", 39],
    [":", 11],
    [":=", 53],
    [";", 13],
    ["<", 20],
    ["<<", 33],
    ["<<=", 44],
    ["<=", 29],
    ["=", 22],
    ["==", 27],
    [">", 21],
    [">=", 30],
    [">>", 34],
    [">>=", 45],
    ["@", 49],
    ["@=", 50],
    ["[", 9],
    ["]", 10],
    ["^", 32],
    ["^=", 43],
    ["{", 25],
    ["|", 18],
    ["|=", 42],
    ["}", 26],
    ["~", 31],
]);

// src/ast/errors.ts
var pySyntaxError = class extends SyntaxError {
    constructor(msg, traceback) {
        super(msg);
        this.traceback = traceback;
    }
    get [Symbol.toStringTag]() {
        return this.constructor._name;
    }
    get name() {
        return this.constructor._name;
    }
};
pySyntaxError._name = "SyntaxError";
var pyIndentationError = class extends pySyntaxError {};
pyIndentationError._name = "IndentationError";

// src/tokenize/tokenize.ts
var TokenInfo = class {
    constructor(type, string, start, end, line) {
        this.type = type;
        this.string = string;
        this.start = start;
        this.end = end;
        this.line = line;
    }
    get lineno() {
        return this.start[0];
    }
    get col_offset() {
        return this.start[1];
    }
    get [Symbol.toStringTag]() {
        return "TokenInfo";
    }
};
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reHasRegExpChar = RegExp(reRegExpChar.source);
function regexEscape(string) {
    return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
}
var capturegroup = (...choices) => "(" + choices.join("|") + ")";
var group = (...choices) => "(?:" + choices.join("|") + ")";
var maybe = (...choices) => group(...choices) + "?";
function rstrip(input, what) {
    let i;
    for (i = input.length; i > 0; --i) {
        if (what.indexOf(input.charAt(i - 1)) === -1) {
            break;
        }
    }
    return input.substring(0, i);
}
var Whitespace = "[ \\f\\t]*";
var Comment = "#[^\\r\\n]*";
var Name = "[" + w + "]+";
var Exponent = "[eE][-+]?[0-9](?:_?[0-9])*";
var Pointfloat = group("[0-9](?:_?[0-9])*\\.(?:[0-9](?:_?[0-9])*)?", "\\.[0-9](?:_?[0-9])*") + maybe(Exponent);
var Expfloat = "[0-9](?:_?[0-9])*" + Exponent;
var Floatnumber = group(Pointfloat, Expfloat);
var Imagnumber = group("[0-9](?:_?[0-9])*[jJ]", Floatnumber + "[jJ]");
var _all_string_prefixes = [
    "",
    "FR",
    "RF",
    "Br",
    "BR",
    "Fr",
    "r",
    "B",
    "R",
    "b",
    "bR",
    "f",
    "rb",
    "rB",
    "F",
    "Rf",
    "U",
    "rF",
    "u",
    "RB",
    "br",
    "fR",
    "fr",
    "rf",
    "Rb",
];
var StringPrefix = group(..._all_string_prefixes);
var Single = "^[^'\\\\]*(?:\\\\.[^'\\\\]*)*'";
var Double = '^[^"\\\\]*(?:\\\\.[^"\\\\]*)*"';
var Single3 = "^[^'\\\\]*(?:(?:\\\\.|'(?!''))[^'\\\\]*)*'''";
var Double3 = '^[^"\\\\]*(?:(?:\\\\.|"(?!""))[^"\\\\]*)*"""';
var Triple = group(StringPrefix + "'''", StringPrefix + '"""');
var EXACT_TOKENS_SORTED = [...EXACT_TOKEN_TYPES.keys()].sort();
var Special = group(...EXACT_TOKENS_SORTED.reverse().map((t) => regexEscape(t)));
var Funny = group("\\r?\\n", Special);
var ContStr = group(
    StringPrefix + "'[^\\n'\\\\]*(?:\\\\.[^\\n'\\\\]*)*" + group("'", "\\\\\\r?\\n"),
    StringPrefix + '"[^\\n"\\\\]*(?:\\\\.[^\\n"\\\\]*)*' + group('"', "\\\\\\r?\\n")
);
var PseudoExtras = group("\\\\\\r?\\n|$", Comment, Triple);
var endpats = {};
var prefixes = _all_string_prefixes;
for (const _prefix of prefixes) {
    endpats[_prefix + "'"] = new RegExp(Single);
    endpats[_prefix + '"'] = new RegExp(Double);
    endpats[_prefix + "'''"] = new RegExp(Single3);
    endpats[_prefix + '"""'] = new RegExp(Double3);
}
var single_quoted = new Set();
var triple_quoted = new Set();
for (const t of prefixes) {
    single_quoted.add(t + '"');
    single_quoted.add(t + "'");
    triple_quoted.add(t + '"""');
    triple_quoted.add(t + "'''");
}
var tabsize = 8;
var Hexnumber = "0[xX](?:_?[0-9a-fA-F])+";
var Binnumber = "0[bB](?:_?[01])+";
var Octnumber = "0[oO](?:_?[0-7])+";
var Decnumber = "(?:0(?:_?0)*|[1-9](?:_?[0-9])*)";
var Intnumber = group(Hexnumber, Binnumber, Octnumber, Decnumber);
var Number_ = group(Imagnumber, Floatnumber, Intnumber);
var PseudoToken = Whitespace + capturegroup(PseudoExtras, Number_, Funny, ContStr, Name);
var PseudoTokenRegexp = new RegExp(PseudoToken);
var UnknownFile = "<unknown>";
function tokenize(readline, filename = UnknownFile) {
    return _tokenize(readline, filename);
}
function* _tokenize(readline, filename = UnknownFile) {
    let lnum = 0,
        parenlev = 0,
        continued = 0,
        contstr = "",
        needcont = 0,
        contline = null,
        indents = [0],
        endprog = / /g,
        strstart = [0, 0];
    let lastline = "";
    let line = "";
    while (true) {
        lastline = line;
        line = readline.next().value || "";
        lnum += 1;
        let pos = 0;
        const max = line.length;
        if (contstr) {
            if (!line) {
                yield new TokenInfo(tokens.ERRORTOKEN, "EOF in multi-line statement", [lnum, pos], [lnum, pos], line);
                throw new pySyntaxError("EOF in multi-line string", [filename, ...strstart, lastline]);
            }
            endprog.lastIndex = 0;
            const endmatch = endprog.exec(line);
            if (endmatch !== null) {
                const end = (pos = endmatch[0].length);
                yield new TokenInfo(
                    tokens.STRING,
                    contstr + line.substring(0, end),
                    strstart,
                    [lnum, end],
                    contline + line
                );
                contstr = "";
                needcont = 0;
                contline = null;
            } else if (
                needcont &&
                line.substring(line.length - 2) !== "\\\n" &&
                line.substring(line.length - 3) !== "\\\r\n"
            ) {
                yield new TokenInfo(tokens.ERRORTOKEN, contstr + line, strstart, [lnum, line.length], contline);
                contstr = "";
                contline = null;
                continue;
            } else {
                contstr = contstr + line;
                contline = contline + line;
                continue;
            }
        } else if (parenlev === 0 && !continued) {
            if (!line) {
                break;
            }
            let column = 0;
            while (pos < max) {
                const curr2 = line[pos];
                if (curr2 === " ") {
                    column += 1;
                } else if (curr2 === "	") {
                    column = Math.floor(column / tabsize + 1) * tabsize;
                } else if (curr2 === "\f") {
                    column = 0;
                } else {
                    break;
                }
                pos += 1;
            }
            if (pos === max) {
                break;
            }
            const curr = line[pos];
            if (curr === "#" || curr === "\r" || curr === "\n") {
                if (curr === "#") {
                    const commentoken = rstrip(line.substring(pos), "\r\n");
                    yield new TokenInfo(
                        tokens.COMMENT,
                        commentoken,
                        [lnum, pos],
                        [lnum, pos + commentoken.length],
                        line
                    );
                    pos += commentoken.length;
                }
                yield new TokenInfo(tokens.NL, line.substring(pos), [lnum, pos], [lnum, line.length], line);
                continue;
            }
            if (column > indents[indents.length - 1]) {
                indents.push(column);
                yield new TokenInfo(tokens.INDENT, line.substring(pos), [lnum, 0], [lnum, pos], line);
            }
            while (column < indents[indents.length - 1]) {
                if (!indents.includes(column)) {
                    throw new pyIndentationError("unindent does not match any outer indentation level", [
                        filename,
                        lnum,
                        pos,
                        line,
                    ]);
                }
                indents = indents.slice(0, -1);
                yield new TokenInfo(tokens.DEDENT, "", [lnum, pos], [lnum, pos], line);
            }
        } else {
            if (!line) {
                yield new TokenInfo(tokens.ERRORTOKEN, "EOF in multi-line statement", [lnum, pos], [lnum, pos], line);
                throw new pySyntaxError("EOF in multi-line statement", [filename, lnum, 0, lastline]);
            }
            continued = 0;
        }
        while (pos < max) {
            let capos = line[pos];
            while (capos === " " || capos === "\f" || capos === "	") {
                capos = line[++pos];
            }
            const pseudomatch = PseudoTokenRegexp.exec(line.substring(pos));
            let maybeQuote = false;
            if (pseudomatch !== null) {
                const start = pos;
                const end = start + pseudomatch[1].length;
                const spos = [lnum, start];
                const epos = [lnum, end];
                pos = end;
                if (start === end) {
                    continue;
                }
                let token = line.substring(start, end);
                const initial = line[start];
                if (
                    (initial === "." && token !== "." && token !== "...") ||
                    initial === "0" ||
                    initial === "1" ||
                    initial === "2" ||
                    initial === "3" ||
                    initial === "4" ||
                    initial === "5" ||
                    initial === "6" ||
                    initial === "7" ||
                    initial === "8" ||
                    initial === "9"
                ) {
                    yield new TokenInfo(tokens.NUMBER, token, spos, epos, line);
                } else if (initial === "\r" || initial === "\n") {
                    if (parenlev > 0) {
                        yield new TokenInfo(tokens.NL, token, spos, epos, line);
                    } else {
                        yield new TokenInfo(tokens.NEWLINE, token, spos, epos, line);
                    }
                } else if (initial === "#") {
                    yield new TokenInfo(tokens.COMMENT, token, spos, epos, line);
                } else if (
                    token === "'''" ||
                    token === '"""' ||
                    ((maybeQuote =
                        initial === "f" ||
                        initial === "r" ||
                        initial === "b" ||
                        initial === "u" ||
                        initial === "F" ||
                        initial === "R" ||
                        initial === "B" ||
                        initial === "U") &&
                        triple_quoted.has(token))
                ) {
                    endprog = endpats[token];
                    const endmatch = endprog.exec(line.substring(pos));
                    if (endmatch !== null) {
                        pos = endmatch[0].length + pos;
                        token = line.substring(start, pos);
                        yield new TokenInfo(tokens.STRING, token, spos, [lnum, pos], line);
                    } else {
                        strstart = [lnum, start];
                        contstr = line.substring(start);
                        contline = line;
                        break;
                    }
                } else if (
                    initial === "'" ||
                    initial === '"' ||
                    (maybeQuote &&
                        (single_quoted.has(token.substring(0, 2)) || single_quoted.has(token.substring(0, 3))))
                ) {
                    if (token[token.length - 1] === "\n") {
                        strstart = [lnum, start];
                        endprog = endpats[initial] || endpats[token[1]] || endpats[token[2]];
                        contstr = line.substring(start);
                        needcont = 1;
                        contline = line;
                        break;
                    } else {
                        yield new TokenInfo(tokens.STRING, token, spos, epos, line);
                    }
                } else if (initial === "a") {
                    if (token === "async") {
                        yield new TokenInfo(tokens.ASYNC, token, spos, epos, line);
                    } else if (token === "await") {
                        yield new TokenInfo(tokens.AWAIT, token, spos, epos, line);
                    } else {
                        yield new TokenInfo(tokens.NAME, token, spos, epos, line);
                    }
                } else if (maybeQuote || initialIsIdentifier(initial)) {
                    yield new TokenInfo(tokens.NAME, token, spos, epos, line);
                } else if (initial === "\\") {
                    continued = 1;
                } else {
                    if (initial === "(" || initial === "[" || initial === "{") {
                        parenlev += 1;
                    } else if (initial === ")" || initial === "]" || initial === "}") {
                        parenlev -= 1;
                    }
                    const type = EXACT_TOKEN_TYPES.get(token) || tokens.OP;
                    yield new TokenInfo(type, token, spos, epos, line);
                }
            } else {
                yield new TokenInfo(tokens.ERRORTOKEN, line[pos], [lnum, pos], [lnum, pos + 1], line);
                pos += 1;
            }
        }
    }
    if (lastline && !"\r\n".includes(lastline[lastline.length - 1])) {
        yield new TokenInfo(tokens.NEWLINE, "", [lnum - 1, lastline.length], [lnum - 1, lastline.length + 1], "");
    }
    for (const _ in indents.slice(1)) {
        yield new TokenInfo(tokens.DEDENT, "", [lnum, 0], [lnum, 0], "");
    }
    yield new TokenInfo(tokens.ENDMARKER, "", [lnum, 0], [lnum, 0], "");
}

// src/tokenize/Tokenizer.ts
var Tokenizer = class {
    constructor(tokengen) {
        this._gen = tokengen;
        this._tokens = [];
        this._fmode = false;
        this._lineno = 0;
        this._offset = 0;
    }
    _adjust_offset(tok) {
        const start = tok.start;
        const end = tok.end;
        if (start[0] === 1) {
            start[1] += this._offset;
            if (end[0] === 1) {
                end[1] += this._offset;
            }
        }
        start[0] += this._lineno;
        end[0] += this._lineno;
    }
    getnext() {
        while (true) {
            const tok = this._gen.next().value;
            const type = tok.type;
            if (type === NL || type === COMMENT) {
                continue;
            } else if (type === ERRORTOKEN && isSpace(tok.string)) {
                continue;
            }
            if (this._fmode) {
                this._adjust_offset(tok);
            }
            this._tokens.push(tok);
            return tok;
        }
    }
    set starting_lineno(lineno) {
        this._lineno = lineno;
        this._fmode = lineno === 0 ? this._fmode : true;
    }
    set starting_col_offset(offset) {
        this._offset = offset;
        this._fmode = offset === 0 ? this._fmode : true;
    }
};

// src/tokenize/readline.ts
var splitLines = /^.*$/gm;
function* readString(text) {
    for (const match of text.matchAll(splitLines)) {
        yield match[0] + "\n";
    }
}

// src/tokenize/mod.ts
function tokenizerFromString(text, filename = "<string>") {
    return new Tokenizer(tokenize(readString(text), filename));
}

// src/ast/astnodes.ts
var AST = class {
    get [Symbol.toStringTag]() {
        return this.constructor._name;
    }
};
AST._name = "AST";
AST.prototype._attributes = [];
AST.prototype._fields = [];
AST.prototype._enum = false;
var _attrs = ["lineno", "col_offset", "end_lineno", "end_col_offset"];
var expr_context = class extends AST {};
expr_context._name = "expr_context";
expr_context.prototype._enum = true;
var LoadType = class extends expr_context {};
LoadType._name = "Load";
var StoreType = class extends expr_context {};
StoreType._name = "Store";
var DelType = class extends expr_context {};
DelType._name = "Del";
var Load = new LoadType();
var Store = new StoreType();
var Del = new DelType();
var boolop = class extends AST {};
boolop._name = "boolop";
boolop.prototype._enum = true;
var AndType = class extends boolop {};
AndType._name = "And";
var OrType = class extends boolop {};
OrType._name = "Or";
var And = new AndType();
var Or = new OrType();
var operator = class extends AST {};
operator._name = "operator";
operator.prototype._enum = true;
var AddType = class extends operator {};
AddType._name = "Add";
var SubType = class extends operator {};
SubType._name = "Sub";
var MultType = class extends operator {};
MultType._name = "Mult";
var MatMultType = class extends operator {};
MatMultType._name = "MatMult";
var DivType = class extends operator {};
DivType._name = "Div";
var ModType = class extends operator {};
ModType._name = "Mod";
var PowType = class extends operator {};
PowType._name = "Pow";
var LShiftType = class extends operator {};
LShiftType._name = "LShift";
var RShiftType = class extends operator {};
RShiftType._name = "RShift";
var BitOrType = class extends operator {};
BitOrType._name = "BitOr";
var BitXorType = class extends operator {};
BitXorType._name = "BitXor";
var BitAndType = class extends operator {};
BitAndType._name = "BitAnd";
var FloorDivType = class extends operator {};
FloorDivType._name = "FloorDiv";
var Add = new AddType();
var Sub = new SubType();
var Mult = new MultType();
var MatMult = new MatMultType();
var Div = new DivType();
var Mod = new ModType();
var Pow = new PowType();
var LShift = new LShiftType();
var RShift = new RShiftType();
var BitOr = new BitOrType();
var BitXor = new BitXorType();
var BitAnd = new BitAndType();
var FloorDiv = new FloorDivType();
var unaryop = class extends AST {};
unaryop._name = "unaryop";
unaryop.prototype._enum = true;
var InvertType = class extends unaryop {};
InvertType._name = "Invert";
var NotType = class extends unaryop {};
NotType._name = "Not";
var UAddType = class extends unaryop {};
UAddType._name = "UAdd";
var USubType = class extends unaryop {};
USubType._name = "USub";
var Invert = new InvertType();
var Not = new NotType();
var UAdd = new UAddType();
var USub = new USubType();
var cmpop = class extends AST {};
cmpop._name = "cmpop";
cmpop.prototype._enum = true;
var EqType = class extends cmpop {};
EqType._name = "Eq";
var NotEqType = class extends cmpop {};
NotEqType._name = "NotEq";
var LtType = class extends cmpop {};
LtType._name = "Lt";
var LtEType = class extends cmpop {};
LtEType._name = "LtE";
var GtType = class extends cmpop {};
GtType._name = "Gt";
var GtEType = class extends cmpop {};
GtEType._name = "GtE";
var IsType = class extends cmpop {};
IsType._name = "Is";
var IsNotType = class extends cmpop {};
IsNotType._name = "IsNot";
var InType = class extends cmpop {};
InType._name = "In";
var NotInType = class extends cmpop {};
NotInType._name = "NotIn";
var Eq = new EqType();
var NotEq = new NotEqType();
var Lt2 = new LtType();
var LtE = new LtEType();
var Gt = new GtType();
var GtE = new GtEType();
var Is = new IsType();
var IsNot = new IsNotType();
var In = new InType();
var NotIn = new NotInType();
var mod = class extends AST {};
mod._name = "mod";
var Module = class extends mod {
    constructor(body, type_ignores) {
        super();
        this.body = body || [];
        this.type_ignores = type_ignores || [];
    }
};
Module._name = "Module";
Module.prototype._fields = ["body", "type_ignores"];
var Interactive = class extends mod {
    constructor(body) {
        super();
        this.body = body || [];
    }
};
Interactive._name = "Interactive";
Interactive.prototype._fields = ["body"];
var Expression = class extends mod {
    constructor(body) {
        super();
        this.body = body;
    }
};
Expression._name = "Expression";
Expression.prototype._fields = ["body"];
var FunctionType = class extends mod {
    constructor(argtypes, returns) {
        super();
        this.argtypes = argtypes || [];
        this.returns = returns;
    }
};
FunctionType._name = "FunctionType";
FunctionType.prototype._fields = ["argtypes", "returns"];
var stmt = class extends AST {
    constructor(lineno, col_offset, end_lineno, end_col_offset) {
        super();
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
};
stmt._name = "stmt";
stmt.prototype._attributes = _attrs;
var FunctionDef = class extends stmt {
    constructor(name, args, body, decorator_list, returns, type_comment, ...attrs) {
        super(...attrs);
        this.name = name;
        this.args = args;
        this.body = body || [];
        this.decorator_list = decorator_list || [];
        this.returns = returns;
        this.type_comment = type_comment;
    }
};
FunctionDef._name = "FunctionDef";
FunctionDef.prototype._fields = ["name", "args", "body", "decorator_list", "returns", "type_comment"];
var AsyncFunctionDef = class extends stmt {
    constructor(name, args, body, decorator_list, returns, type_comment, ...attrs) {
        super(...attrs);
        this.name = name;
        this.args = args;
        this.body = body || [];
        this.decorator_list = decorator_list || [];
        this.returns = returns;
        this.type_comment = type_comment;
    }
};
AsyncFunctionDef._name = "AsyncFunctionDef";
AsyncFunctionDef.prototype._fields = ["name", "args", "body", "decorator_list", "returns", "type_comment"];
var ClassDef = class extends stmt {
    constructor(name, bases, keywords, body, decorator_list, ...attrs) {
        super(...attrs);
        this.name = name;
        this.bases = bases || [];
        this.keywords = keywords || [];
        this.body = body || [];
        this.decorator_list = decorator_list || [];
    }
};
ClassDef._name = "ClassDef";
ClassDef.prototype._fields = ["name", "bases", "keywords", "body", "decorator_list"];
var Return = class extends stmt {
    constructor(value, ...attrs) {
        super(...attrs);
        this.value = value;
    }
};
Return._name = "Return";
Return.prototype._fields = ["value"];
var Delete = class extends stmt {
    constructor(targets, ...attrs) {
        super(...attrs);
        this.targets = targets || [];
    }
};
Delete._name = "Delete";
Delete.prototype._fields = ["targets"];
var Assign = class extends stmt {
    constructor(targets, value, type_comment, ...attrs) {
        super(...attrs);
        this.targets = targets || [];
        this.value = value;
        this.type_comment = type_comment;
    }
};
Assign._name = "Assign";
Assign.prototype._fields = ["targets", "value", "type_comment"];
var AugAssign = class extends stmt {
    constructor(target, op, value, ...attrs) {
        super(...attrs);
        this.target = target;
        this.op = op;
        this.value = value;
    }
};
AugAssign._name = "AugAssign";
AugAssign.prototype._fields = ["target", "op", "value"];
var AnnAssign = class extends stmt {
    constructor(target, annotation, value, simple, ...attrs) {
        super(...attrs);
        this.target = target;
        this.annotation = annotation;
        this.value = value;
        this.simple = simple;
    }
};
AnnAssign._name = "AnnAssign";
AnnAssign.prototype._fields = ["target", "annotation", "value", "simple"];
var For = class extends stmt {
    constructor(target, iter, body, orelse, type_comment, ...attrs) {
        super(...attrs);
        this.target = target;
        this.iter = iter;
        this.body = body || [];
        this.orelse = orelse || [];
        this.type_comment = type_comment;
    }
};
For._name = "For";
For.prototype._fields = ["target", "iter", "body", "orelse", "type_comment"];
var AsyncFor = class extends stmt {
    constructor(target, iter, body, orelse, type_comment, ...attrs) {
        super(...attrs);
        this.target = target;
        this.iter = iter;
        this.body = body || [];
        this.orelse = orelse || [];
        this.type_comment = type_comment;
    }
};
AsyncFor._name = "AsyncFor";
AsyncFor.prototype._fields = ["target", "iter", "body", "orelse", "type_comment"];
var While = class extends stmt {
    constructor(test, body, orelse, ...attrs) {
        super(...attrs);
        this.test = test;
        this.body = body || [];
        this.orelse = orelse || [];
    }
};
While._name = "While";
While.prototype._fields = ["test", "body", "orelse"];
var If = class extends stmt {
    constructor(test, body, orelse, ...attrs) {
        super(...attrs);
        this.test = test;
        this.body = body || [];
        this.orelse = orelse || [];
    }
};
If._name = "If";
If.prototype._fields = ["test", "body", "orelse"];
var With = class extends stmt {
    constructor(items, body, type_comment, ...attrs) {
        super(...attrs);
        this.items = items || [];
        this.body = body || [];
        this.type_comment = type_comment;
    }
};
With._name = "With";
With.prototype._fields = ["items", "body", "type_comment"];
var AsyncWith = class extends stmt {
    constructor(items, body, type_comment, ...attrs) {
        super(...attrs);
        this.items = items || [];
        this.body = body || [];
        this.type_comment = type_comment;
    }
};
AsyncWith._name = "AsyncWith";
AsyncWith.prototype._fields = ["items", "body", "type_comment"];
var Raise = class extends stmt {
    constructor(exc, cause, ...attrs) {
        super(...attrs);
        this.exc = exc;
        this.cause = cause;
    }
};
Raise._name = "Raise";
Raise.prototype._fields = ["exc", "cause"];
var Try = class extends stmt {
    constructor(body, handlers, orelse, finalbody, ...attrs) {
        super(...attrs);
        this.body = body || [];
        this.handlers = handlers || [];
        this.orelse = orelse || [];
        this.finalbody = finalbody || [];
    }
};
Try._name = "Try";
Try.prototype._fields = ["body", "handlers", "orelse", "finalbody"];
var Assert = class extends stmt {
    constructor(test, msg, ...attrs) {
        super(...attrs);
        this.test = test;
        this.msg = msg;
    }
};
Assert._name = "Assert";
Assert.prototype._fields = ["test", "msg"];
var Import = class extends stmt {
    constructor(names, ...attrs) {
        super(...attrs);
        this.names = names || [];
    }
};
Import._name = "Import";
Import.prototype._fields = ["names"];
var ImportFrom = class extends stmt {
    constructor(module, names, level, ...attrs) {
        super(...attrs);
        this.module = module;
        this.names = names || [];
        this.level = level;
    }
};
ImportFrom._name = "ImportFrom";
ImportFrom.prototype._fields = ["module", "names", "level"];
var Global = class extends stmt {
    constructor(names, ...attrs) {
        super(...attrs);
        this.names = names || [];
    }
};
Global._name = "Global";
Global.prototype._fields = ["names"];
var Nonlocal = class extends stmt {
    constructor(names, ...attrs) {
        super(...attrs);
        this.names = names || [];
    }
};
Nonlocal._name = "Nonlocal";
Nonlocal.prototype._fields = ["names"];
var Expr = class extends stmt {
    constructor(value, ...attrs) {
        super(...attrs);
        this.value = value;
    }
};
Expr._name = "Expr";
Expr.prototype._fields = ["value"];
var Pass = class extends stmt {
    constructor(...attrs) {
        super(...attrs);
    }
};
Pass._name = "Pass";
Pass.prototype._fields = [];
var Break = class extends stmt {
    constructor(...attrs) {
        super(...attrs);
    }
};
Break._name = "Break";
Break.prototype._fields = [];
var Continue = class extends stmt {
    constructor(...attrs) {
        super(...attrs);
    }
};
Continue._name = "Continue";
Continue.prototype._fields = [];
var Debugger = class extends stmt {
    constructor(...attrs) {
        super(...attrs);
    }
};
Debugger._name = "Debugger";
Debugger.prototype._fields = [];
var expr = class extends AST {
    constructor(lineno, col_offset, end_lineno, end_col_offset) {
        super();
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
};
expr._name = "expr";
expr.prototype._attributes = _attrs;
var BoolOp = class extends expr {
    constructor(op, values, ...attrs) {
        super(...attrs);
        this.op = op;
        this.values = values || [];
    }
};
BoolOp._name = "BoolOp";
BoolOp.prototype._fields = ["op", "values"];
var NamedExpr = class extends expr {
    constructor(target, value, ...attrs) {
        super(...attrs);
        this.target = target;
        this.value = value;
    }
};
NamedExpr._name = "NamedExpr";
NamedExpr.prototype._fields = ["target", "value"];
var BinOp = class extends expr {
    constructor(left, op, right, ...attrs) {
        super(...attrs);
        this.left = left;
        this.op = op;
        this.right = right;
    }
};
BinOp._name = "BinOp";
BinOp.prototype._fields = ["left", "op", "right"];
var UnaryOp = class extends expr {
    constructor(op, operand, ...attrs) {
        super(...attrs);
        this.op = op;
        this.operand = operand;
    }
};
UnaryOp._name = "UnaryOp";
UnaryOp.prototype._fields = ["op", "operand"];
var Lambda = class extends expr {
    constructor(args, body, ...attrs) {
        super(...attrs);
        this.args = args;
        this.body = body;
    }
};
Lambda._name = "Lambda";
Lambda.prototype._fields = ["args", "body"];
var IfExp = class extends expr {
    constructor(test, body, orelse, ...attrs) {
        super(...attrs);
        this.test = test;
        this.body = body;
        this.orelse = orelse;
    }
};
IfExp._name = "IfExp";
IfExp.prototype._fields = ["test", "body", "orelse"];
var Dict = class extends expr {
    constructor(keys, values, ...attrs) {
        super(...attrs);
        this.keys = keys || [];
        this.values = values || [];
    }
};
Dict._name = "Dict";
Dict.prototype._fields = ["keys", "values"];
var Set2 = class extends expr {
    constructor(elts, ...attrs) {
        super(...attrs);
        this.elts = elts || [];
    }
};
Set2._name = "Set";
Set2.prototype._fields = ["elts"];
var ListComp = class extends expr {
    constructor(elt, generators, ...attrs) {
        super(...attrs);
        this.elt = elt;
        this.generators = generators || [];
    }
};
ListComp._name = "ListComp";
ListComp.prototype._fields = ["elt", "generators"];
var SetComp = class extends expr {
    constructor(elt, generators, ...attrs) {
        super(...attrs);
        this.elt = elt;
        this.generators = generators || [];
    }
};
SetComp._name = "SetComp";
SetComp.prototype._fields = ["elt", "generators"];
var DictComp = class extends expr {
    constructor(key, value, generators, ...attrs) {
        super(...attrs);
        this.key = key;
        this.value = value;
        this.generators = generators || [];
    }
};
DictComp._name = "DictComp";
DictComp.prototype._fields = ["key", "value", "generators"];
var GeneratorExp = class extends expr {
    constructor(elt, generators, ...attrs) {
        super(...attrs);
        this.elt = elt;
        this.generators = generators || [];
    }
};
GeneratorExp._name = "GeneratorExp";
GeneratorExp.prototype._fields = ["elt", "generators"];
var Await = class extends expr {
    constructor(value, ...attrs) {
        super(...attrs);
        this.value = value;
    }
};
Await._name = "Await";
Await.prototype._fields = ["value"];
var Yield = class extends expr {
    constructor(value, ...attrs) {
        super(...attrs);
        this.value = value;
    }
};
Yield._name = "Yield";
Yield.prototype._fields = ["value"];
var YieldFrom = class extends expr {
    constructor(value, ...attrs) {
        super(...attrs);
        this.value = value;
    }
};
YieldFrom._name = "YieldFrom";
YieldFrom.prototype._fields = ["value"];
var Compare = class extends expr {
    constructor(left, ops, comparators, ...attrs) {
        super(...attrs);
        this.left = left;
        this.ops = ops || [];
        this.comparators = comparators || [];
    }
};
Compare._name = "Compare";
Compare.prototype._fields = ["left", "ops", "comparators"];
var Call = class extends expr {
    constructor(func, args, keywords, ...attrs) {
        super(...attrs);
        this.func = func;
        this.args = args || [];
        this.keywords = keywords || [];
    }
};
Call._name = "Call";
Call.prototype._fields = ["func", "args", "keywords"];
var FormattedValue = class extends expr {
    constructor(value, conversion, format_spec, ...attrs) {
        super(...attrs);
        this.value = value;
        this.conversion = conversion;
        this.format_spec = format_spec;
    }
};
FormattedValue._name = "FormattedValue";
FormattedValue.prototype._fields = ["value", "conversion", "format_spec"];
var JoinedStr = class extends expr {
    constructor(values, ...attrs) {
        super(...attrs);
        this.values = values || [];
    }
};
JoinedStr._name = "JoinedStr";
JoinedStr.prototype._fields = ["values"];
var Constant = class extends expr {
    constructor(value, kind, ...attrs) {
        super(...attrs);
        this.value = value;
        this.kind = kind;
    }
};
Constant._name = "Constant";
Constant.prototype._fields = ["value", "kind"];
var Attribute = class extends expr {
    constructor(value, attr, ctx, ...attrs) {
        super(...attrs);
        this.value = value;
        this.attr = attr;
        this.ctx = ctx;
    }
};
Attribute._name = "Attribute";
Attribute.prototype._fields = ["value", "attr", "ctx"];
var Subscript = class extends expr {
    constructor(value, slice, ctx, ...attrs) {
        super(...attrs);
        this.value = value;
        this.slice = slice;
        this.ctx = ctx;
    }
};
Subscript._name = "Subscript";
Subscript.prototype._fields = ["value", "slice", "ctx"];
var Starred = class extends expr {
    constructor(value, ctx, ...attrs) {
        super(...attrs);
        this.value = value;
        this.ctx = ctx;
    }
};
Starred._name = "Starred";
Starred.prototype._fields = ["value", "ctx"];
var Name2 = class extends expr {
    constructor(id, ctx, ...attrs) {
        super(...attrs);
        this.id = id;
        this.ctx = ctx;
    }
};
Name2._name = "Name";
Name2.prototype._fields = ["id", "ctx"];
var List = class extends expr {
    constructor(elts, ctx, ...attrs) {
        super(...attrs);
        this.elts = elts || [];
        this.ctx = ctx;
    }
};
List._name = "List";
List.prototype._fields = ["elts", "ctx"];
var Tuple = class extends expr {
    constructor(elts, ctx, ...attrs) {
        super(...attrs);
        this.elts = elts || [];
        this.ctx = ctx;
    }
};
Tuple._name = "Tuple";
Tuple.prototype._fields = ["elts", "ctx"];
var Slice = class extends expr {
    constructor(lower, upper, step, ...attrs) {
        super(...attrs);
        this.lower = lower;
        this.upper = upper;
        this.step = step;
    }
};
Slice._name = "Slice";
Slice.prototype._fields = ["lower", "upper", "step"];
var comprehension = class extends AST {
    constructor(target, iter, ifs, is_async) {
        super();
        this.target = target;
        this.iter = iter;
        this.ifs = ifs || [];
        this.is_async = is_async;
    }
};
comprehension._name = "comprehension";
comprehension.prototype._fields = ["target", "iter", "ifs", "is_async"];
var excepthandler = class extends AST {
    constructor(lineno, col_offset, end_lineno, end_col_offset) {
        super();
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
};
excepthandler._name = "excepthandler";
excepthandler.prototype._attributes = _attrs;
var ExceptHandler = class extends excepthandler {
    constructor(type, name, body, ...attrs) {
        super(...attrs);
        this.type = type;
        this.name = name;
        this.body = body || [];
    }
};
ExceptHandler._name = "ExceptHandler";
ExceptHandler.prototype._fields = ["type", "name", "body"];
var arguments_ = class extends AST {
    constructor(posonlyargs, args, vararg, kwonlyargs, kw_defaults, kwarg, defaults) {
        super();
        this.posonlyargs = posonlyargs || [];
        this.args = args || [];
        this.vararg = vararg;
        this.kwonlyargs = kwonlyargs || [];
        this.kw_defaults = kw_defaults || [];
        this.kwarg = kwarg;
        this.defaults = defaults || [];
    }
};
arguments_._name = "arguments";
arguments_.prototype._fields = ["posonlyargs", "args", "vararg", "kwonlyargs", "kw_defaults", "kwarg", "defaults"];
var arg = class extends AST {
    constructor(arg2, annotation, type_comment, lineno, col_offset, end_lineno, end_col_offset) {
        super();
        this.arg = arg2;
        this.annotation = annotation;
        this.type_comment = type_comment;
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
};
arg._name = "arg";
arg.prototype._fields = ["arg", "annotation", "type_comment"];
arg.prototype._attributes = _attrs;
var keyword = class extends AST {
    constructor(arg2, value, lineno, col_offset, end_lineno, end_col_offset) {
        super();
        this.arg = arg2;
        this.value = value;
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
};
keyword._name = "keyword";
keyword.prototype._fields = ["arg", "value"];
keyword.prototype._attributes = _attrs;
var alias = class extends AST {
    constructor(name, asname) {
        super();
        this.name = name;
        this.asname = asname;
    }
};
alias._name = "alias";
alias.prototype._fields = ["name", "asname"];
var withitem = class extends AST {
    constructor(context_expr, optional_vars) {
        super();
        this.context_expr = context_expr;
        this.optional_vars = optional_vars;
    }
};
withitem._name = "withitem";
withitem.prototype._fields = ["context_expr", "optional_vars"];
var type_ignore = class extends AST {};
type_ignore._name = "type_ignore";
var TypeIgnore = class extends type_ignore {
    constructor(lineno, tag) {
        super();
        this.lineno = lineno;
        this.tag = tag;
    }
};
TypeIgnore._name = "TypeIgnore";
TypeIgnore.prototype._fields = ["lineno", "tag"];

// src/parser/pegen_types.ts
var CmpopExprPair = class {
    constructor(cmpop3, expr4) {
        this.cmpop = cmpop3;
        this.expr = expr4;
    }
};
var KeyValuePair = class {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
};
var AugOperator = class {
    constructor(kind) {
        this.kind = kind;
    }
};
var NameDefaultPair = class {
    constructor(arg2, value) {
        this.arg = arg2;
        this.value = value;
    }
};
var SlashWithDefault = class {
    constructor(plain_names, names_with_defaults) {
        this.plain_names = plain_names;
        this.names_with_defaults = names_with_defaults;
    }
};
var StarEtc = class {
    constructor(vararg, kwonlyargs, kwarg) {
        this.vararg = vararg;
        this.kwonlyargs = kwonlyargs;
        this.kwarg = kwarg;
    }
};
var KeywordOrStarred = class {
    constructor(element, is_keyword) {
        this.element = element;
        this.is_keyword = is_keyword;
    }
};
var TARGETS_TYPE;
(function (TARGETS_TYPE2) {
    TARGETS_TYPE2[(TARGETS_TYPE2["STAR_TARGETS"] = 0)] = "STAR_TARGETS";
    TARGETS_TYPE2[(TARGETS_TYPE2["DEL_TARGETS"] = 1)] = "DEL_TARGETS";
    TARGETS_TYPE2[(TARGETS_TYPE2["FOR_TARGETS"] = 2)] = "FOR_TARGETS";
})(TARGETS_TYPE || (TARGETS_TYPE = {}));
var STAR_TARGETS = 0;
var DEL_TARGETS = 1;
var FOR_TARGETS = 2;
var StartRule;
(function (StartRule2) {
    StartRule2[(StartRule2["SINGLE_INPUT"] = 256)] = "SINGLE_INPUT";
    StartRule2[(StartRule2["FILE_INPUT"] = 257)] = "FILE_INPUT";
    StartRule2[(StartRule2["EVAL_INPUT"] = 258)] = "EVAL_INPUT";
    StartRule2[(StartRule2["FUNC_TYPE_INPUT"] = 345)] = "FUNC_TYPE_INPUT";
    StartRule2[(StartRule2["FSTRING_INPUT"] = 800)] = "FSTRING_INPUT";
})(StartRule || (StartRule = {}));
function EXTRA_EXPR(head, tail) {
    tail ??= head;
    return [head.lineno, head.col_offset, tail.end_lineno, tail.end_col_offset];
}

// src/parser/parse_string.ts
var NON_ASCII = /[^\x00-\x7F]/;
function parsestr(p, t) {
    let s = t.string;
    let quote = s[0];
    let fmode = false,
        bytesmode = false,
        rawmode = false;
    let i = 0;
    if (quote !== "'" && quote !== '"') {
        while (true) {
            if (quote === "b" || quote === "B") {
                quote = s[++i];
                bytesmode = true;
            } else if (quote === "u" || quote === "U") {
                quote = s[++i];
            } else if (quote === "r" || quote === "R") {
                quote = s[++i];
                rawmode = true;
            } else if (quote === "f" || quote === "F") {
                quote = s[++i];
                fmode = true;
            } else {
                break;
            }
        }
    }
    if (s.length >= 6 + i && s[i + 1] === quote && s[i + 2] === quote) {
        s = s.slice(i + 3, -3);
    } else {
        s = s.slice(i + 1, -1);
    }
    if (fmode) {
        return [s, fmode, bytesmode, rawmode];
    }
    if (bytesmode && NON_ASCII.test(s)) {
        p.raise_error(pySyntaxError, "bytes can only contain ASCII literal characters.");
    }
    rawmode ||= !s.includes("\\");
    if (rawmode) {
        return [s, fmode, bytesmode, rawmode];
    }
    return [decodeEscape(p, s), fmode, bytesmode, rawmode];
}
function decodeEscape(p, s) {
    let ch;
    const len = s.length;
    let ret = "";
    for (let i = 0; i < len; i++) {
        ch = s[i];
        if (ch === "\\") {
            ch = s[++i];
            if (ch === "n") {
                ret += "\n";
            } else if (ch === "\\") {
                ret += "\\";
            } else if (ch === "t") {
                ret += "	";
            } else if (ch === "r") {
                ret += "\r";
            } else if (ch === "b") {
                ret += "\b";
            } else if (ch === "f") {
                ret += "\f";
            } else if (ch === "v") {
                ret += "\v";
            } else if (ch === "0") {
                ret += "\0";
            } else if (ch === '"') {
                ret += '"';
            } else if (ch === "'") {
                ret += "'";
            } else if (ch === "\n") {
            } else if (ch === "x") {
                if (i + 2 >= len) {
                    p.raise_error(pySyntaxError, "Truncated \\xNN escape");
                }
                ret += String.fromCharCode(parseInt(s.substr(i + 1, 2), 16));
                i += 2;
            } else if (ch === "u") {
                if (i + 4 >= len) {
                    p.raise_error(pySyntaxError, "Truncated \\uXXXX escape");
                }
                ret += String.fromCharCode(parseInt(s.substr(i + 1, 4), 16));
                i += 4;
            } else if (ch === "U") {
                if (i + 8 >= len) {
                    p.raise_error(pySyntaxError, "Truncated \\UXXXXXXXX escape");
                }
                ret += String.fromCodePoint(parseInt(s.substr(i + 1, 8), 16));
                i += 8;
            } else {
                ret += "\\" + ch;
            }
        } else {
            ret += ch;
        }
    }
    return ret;
}
var NEWLINE2 = /\n/g;
function fstring_find_expr_location(parent, fstr, expr_start) {
    let line = parent.start[0];
    let offset = parent.start[1];
    const new_lines = [...fstr.substring(0, expr_start).matchAll(NEWLINE2)];
    const num_lines = new_lines.length;
    if (num_lines === 0) {
        offset += parent.string.indexOf(fstr);
        offset += expr_start;
    } else {
        offset = expr_start - new_lines[num_lines - 1].index;
        line += num_lines;
    }
    return [line, offset];
}
function unexpected_end_of_string(p) {
    p.raise_error(pySyntaxError, "f-string: expecting '}'");
}
var WHITE_SPACE = /^\s*$/;
function fstring_compile_expr(p, str, expr_start, expr_end, t) {
    assert(expr_end >= expr_start);
    assert(str[expr_start - 1] === "{");
    const end_ch = str[expr_end];
    assert(end_ch === "}" || end_ch === "!" || end_ch === ":" || end_ch === "=");
    let s = str.substring(expr_start, expr_end);
    if (WHITE_SPACE.test(s)) {
        p.raise_error(pySyntaxError, "f-string: empty expression not allowed");
    }
    const [lines, cols] = fstring_find_expr_location(t, str, expr_start);
    s = "(" + s + ")";
    const tokenizer = tokenizerFromString(s, p.filename);
    tokenizer.starting_lineno = lines - 1;
    tokenizer.starting_col_offset = cols - 1;
    const p2 = new GeneratedParser(tokenizer, StartRule.FSTRING_INPUT);
    p2.filename = p.filename;
    return p2.parse();
}
function fstring_find_expr(p, str, start, end, raw, recurse_lvl, t) {
    if (recurse_lvl >= 2) {
        p.raise_error(pySyntaxError, "f-string: expressions nested too deeply");
    }
    let i = start;
    assert(str[i] === "{");
    i++;
    const expr_start = i;
    let quote_char = null;
    let string_type = 0;
    let nested_depth = 0;
    let format_spec = null;
    let conversion = null;
    let expr_text = null;
    assert(i <= end);
    for (; i < end; i++) {
        const ch = str[i];
        if (ch === "\\") {
            p.raise_error(pySyntaxError, "f-string expression part cannot include a backslash");
        }
        if (quote_char !== null) {
            if (ch === quote_char) {
                if (string_type === 3) {
                    if (i + 2 < end && str[i + 1] === ch && str[i + 2] === ch) {
                        i += 2;
                        string_type = 0;
                        quote_char = null;
                        continue;
                    }
                } else {
                    quote_char = null;
                    string_type = 0;
                    continue;
                }
            }
        } else if (ch === "'" || ch === '"') {
            if (i + 2 < end && str[i + 1] === ch && str[i + 2] === ch) {
                string_type = 3;
                i += 2;
            } else {
                string_type = 1;
            }
            quote_char = ch;
        } else if (ch === "[" || ch === "{" || ch === "(") {
            nested_depth++;
        } else if (nested_depth !== 0 && (ch === "]" || ch === "}" || ch === ")")) {
            nested_depth--;
        } else if (ch === "#") {
            p.raise_error(pySyntaxError, "f-string expression part cannot include '#'");
        } else if (
            nested_depth === 0 &&
            (ch === "!" || ch === ":" || ch === "}" || ch === "=" || ch === "<" || ch === ">")
        ) {
            if (i + 1 < end) {
                if (str[i + 1] === "=" && (ch === "!" || ch === "=" || ch === "<" || ch === ">")) {
                    i++;
                    continue;
                }
                if (ch === ">" || ch === "<") {
                    continue;
                }
            }
            break;
        } else {
        }
    }
    if (quote_char) {
        p.raise_error(pySyntaxError, "f-string: unterminated string");
    }
    if (nested_depth) {
        p.raise_error(pySyntaxError, "f-string: mismatched '(', '{', or '['");
    }
    const expr_end = i;
    if (expr_start >= expr_end) {
        unexpected_end_of_string(p);
    }
    const simple_expression = fstring_compile_expr(p, str, expr_start, expr_end, t);
    if (str[i] === "=") {
        i++;
        while (WHITE_SPACE.test(str[i])) {
            i++;
        }
        expr_text = str.slice(expr_start, i);
    }
    if (str[i] === "!") {
        i++;
        if (i >= end) unexpected_end_of_string(p);
        conversion = str[i];
        i++;
        if (!(conversion === "s" || conversion === "r" || conversion === "a")) {
            p.raise_error(pySyntaxError, "f-string: invalid conversion character: expected 's', 'r', or 'a'");
        }
    }
    if (i >= end) unexpected_end_of_string(p);
    if (str[i] === ":") {
        i++;
        if (i >= end) unexpected_end_of_string(p);
        [format_spec, i] = fstring_parse(p, str, i, end, raw, recurse_lvl + 1, this.first, t, this.last);
    }
    if (i >= end || str[i] !== "}") unexpected_end_of_string(p);
    i++;
    if (expr_text && format_spec === null && conversion === null) {
        conversion = "r";
    }
    const expr4 = new FormattedValue(
        simple_expression,
        conversion === null ? -1 : conversion.charCodeAt(0),
        format_spec,
        this.a0,
        this.a1,
        this.a2,
        this.a3
    );
    return [expr4, i, expr_text];
}
var BRACES_RE = /(^|[^}])}(}})*($|[^}])/;
var SINGLE_BRACE_RE = /}}/g;
function fstring_find_literal_and_expr(str, start, end, raw, recurse_lvl, t) {
    const p = this.parser;
    let idx = start;
    const addLiteral = (literal) => {
        if (literal.includes("}")) {
            if (BRACES_RE.test(literal)) {
                p.raise_error(pySyntaxError, "f-string: single '}' is not allowed");
            }
            literal = literal.replace(SINGLE_BRACE_RE, "}");
        }
        if (!raw && literal.includes("\\")) {
            literal = decodeEscape(p, literal);
        }
        this.concat(literal);
    };
    while (idx < end) {
        let bidx = str.indexOf("{", idx);
        if (recurse_lvl !== 0) {
            const cbidx = str.indexOf("}", idx);
            if (cbidx !== -1) {
                if (bidx === -1) {
                    end = cbidx;
                } else if (bidx > cbidx) {
                    bidx = -1;
                    end = cbidx;
                }
            }
        }
        if (bidx === -1) {
            addLiteral(str.substring(idx, end));
            idx = end;
            break;
        } else if (bidx + 1 < end && str[bidx + 1] === "{") {
            addLiteral(str.substring(idx, bidx + 1));
            idx = bidx + 2;
            continue;
        } else {
            addLiteral(str.substring(idx, bidx));
            idx = bidx;
            const [expr4, endIdx, expr_text] = fstring_find_expr.call(this, p, str, bidx, end, raw, recurse_lvl, t);
            if (expr_text !== null) {
                this.concat(expr_text);
            }
            if (this.last_str) {
                this.expr_list.push(this.mkStrNode(this.last_str));
                this.last_str = "";
            }
            this.expr_list.push(expr4);
            idx = endIdx;
        }
    }
    return idx;
}
var FstringParser = class {
    constructor(p, first, last) {
        this.parser = p;
        this.last_str = "";
        this.fmode = false;
        this.expr_list = [];
        this.first = first;
        this.last = last;
        this.a0 = first.start[0];
        this.a1 = first.start[1];
        this.a2 = last.end[0];
        this.a3 = last.end[1];
        this.kind = first.string[0] === "u" ? "u" : null;
    }
    concatFstring(fstr, start, end, rawmode, recurse_lvl, t) {
        this.fmode = true;
        return fstring_find_literal_and_expr.call(this, fstr, start, end, rawmode, recurse_lvl, t);
    }
    concat(str) {
        this.last_str += str;
    }
    mkStrNode(str) {
        return new Constant(new pyStr(str), this.kind, this.a0, this.a1, this.a2, this.a3);
    }
    finish() {
        if (!this.fmode) {
            assert(this.expr_list.length === 0);
            return this.mkStrNode(this.last_str);
        }
        if (this.last_str) {
            this.expr_list.push(this.mkStrNode(this.last_str));
        }
        return new JoinedStr(this.expr_list, this.a0, this.a1, this.a2, this.a3);
    }
};
function fstring_parse(p, str, start, end, raw, recurse_lvl, first, t, last) {
    const fstringParser = new FstringParser(p, first, last);
    const i = fstringParser.concatFstring(str, start, end, raw, recurse_lvl, t);
    return [fstringParser.finish(), i];
}

// src/parser/pegen.ts
var InternalAssertionError = class extends Error {
    constructor(message) {
        super(message);
        this.name = "AssertionError";
    }
};
function assert(expr4, msg = "") {
    if (!expr4) {
        throw new InternalAssertionError(msg);
    }
}
function NEW_TYPE_COMMENT(p, tc) {
    if (tc === null) {
        return null;
    }
    return new_type_comment(tc.string);
}
function new_type_comment(s) {
    return s;
}
function add_type_comment_to_arg(p, a, tc) {
    if (tc === null) {
        return a;
    }
    return new arg(a.arg, a.annotation, tc.string, a.lineno, a.col_offset, a.end_lineno, a.end_col_offset);
}
function new_identifier(n) {
    return n;
}
function _create_dummy_identifier(p) {
    return new_identifier("");
}
function get_expr_name(e) {
    assert(e != null);
    switch (e.constructor) {
        case Attribute:
        case Subscript:
        case Starred:
        case Name2:
        case List:
        case Tuple:
        case Lambda:
            return e[Symbol.toStringTag].toLowerCase();
        case Call:
            return "function call";
        case BoolOp:
        case BinOp:
        case UnaryOp:
            return "operator";
        case GeneratorExp:
            return "generator expression";
        case Yield:
        case YieldFrom:
            return "yield expression";
        case Await:
            return "await expression";
        case ListComp:
            return "list comprehension";
        case SetComp:
            return "set comprehension";
        case DictComp:
            return "dict comprehension";
        case Dict:
            return "dict display";
        case Set2:
            return "set display";
        case JoinedStr:
        case FormattedValue:
            return "f-string expression";
        case Constant: {
            const value = e.value;
            switch (value) {
                case pyNone:
                case pyFalse:
                case pyTrue:
                case pyEllipsis:
                    return value.toString();
                default:
                    return "literal";
            }
        }
        case Compare:
            return "comparison";
        case IfExp:
            return "conditional expression";
        case NamedExpr:
            return "named expression";
        default:
            throw new Error("unexpected expression in assignment");
    }
}
function dummy_name(p) {
    return new Name2(_create_dummy_identifier(p), Load, 1, 0, 1, 0);
}
function interactive_exit(p) {
    return null;
}
function singleton_seq(p, a) {
    return [a];
}
function seq_insert_in_front(p, a, seq) {
    assert(a !== null);
    if (seq === null) {
        return singleton_seq(p, a);
    }
    return [a, ...seq];
}
function seq_append_to_end(p, seq, a) {
    assert(a !== null);
    if (seq === null) {
        return [a];
    }
    return seq.concat(a);
}
function seq_flatten(p, seqs) {
    return seqs.flat();
}
function join_names_with_dot(p, first_name, second_name) {
    const first_identifier = first_name.id;
    const second_identifier = second_name.id;
    return new Name2(first_identifier + "." + second_identifier, Load, ...EXTRA_EXPR(first_name, second_name));
}
var UnreachableException = class extends Error {};
function getNumDots(e) {
    switch (e.type) {
        case ELLIPSIS:
            return 3;
        case DOT:
            return 1;
        default:
            throw new UnreachableException();
    }
}
function seq_count_dots(seq) {
    return seq.reduce((a, b) => a + getNumDots(b), 0);
}
function alias_for_star(p) {
    return new alias("*", null);
}
function map_names_to_ids(p, seq) {
    return seq.map((e) => e.id);
}
function get_cmpops(p, seq) {
    return seq.map((pair) => pair.cmpop);
}
function get_exprs(p, seq) {
    return seq.map((pair) => pair.expr);
}
function _set_seq_context(p, seq, ctx) {
    return seq.map((e) => set_expr_context(p, e, ctx));
}
function _set_name_context(p, e, ctx) {
    return new Name2(e.id, ctx, ...EXTRA_EXPR(e));
}
function _set_tuple_context(p, e, ctx) {
    return new Tuple(_set_seq_context(p, e.elts, ctx), ctx, ...EXTRA_EXPR(e));
}
function _set_list_context(p, e, ctx) {
    return new List(_set_seq_context(p, e.elts, ctx), ctx, ...EXTRA_EXPR(e));
}
function _set_subscript_context(p, e, ctx) {
    return new Subscript(e.value, e.slice, ctx, ...EXTRA_EXPR(e));
}
function _set_attribute_context(p, e, ctx) {
    return new Attribute(e.value, e.attr, ctx, ...EXTRA_EXPR(e));
}
function _set_starred_context(p, e, ctx) {
    return new Starred(set_expr_context(p, e.value, ctx), ctx, ...EXTRA_EXPR(e));
}
function set_expr_context(p, e, ctx) {
    assert(expr !== null);
    let newExpr;
    switch (e.constructor) {
        case Name2:
            newExpr = _set_name_context(p, e, ctx);
            break;
        case Tuple:
            newExpr = _set_tuple_context(p, e, ctx);
            break;
        case List:
            newExpr = _set_list_context(p, e, ctx);
            break;
        case Subscript:
            newExpr = _set_subscript_context(p, e, ctx);
            break;
        case Attribute:
            newExpr = _set_attribute_context(p, e, ctx);
            break;
        case Starred:
            newExpr = _set_starred_context(p, e, ctx);
            break;
        default:
            newExpr = e;
    }
    return newExpr;
}
function get_keys(p, seq) {
    if (seq === null) {
        return [];
    }
    return seq.map((kv) => kv.key);
}
function get_values(p, seq) {
    if (seq === null) {
        return [];
    }
    return seq.map((kv) => kv.value);
}
function name_default_pair(p, arg2, value, tc) {
    const a = add_type_comment_to_arg(p, arg2, tc);
    return new NameDefaultPair(a, value);
}
function join_sequences(p, a, b) {
    return a.concat(b);
}
function get_names(p, names_with_defaults) {
    if (names_with_defaults === null) {
        return [];
    }
    return names_with_defaults.map((pair) => pair.arg);
}
function get_defaults(p, names_with_defaults) {
    return names_with_defaults.map((pair) => pair.value);
}
function make_arguments(p, slash_without_default, slash_with_default, plain_names, names_with_default, star_etc) {
    let posonlyargs = [];
    if (slash_without_default !== null) {
        posonlyargs = slash_without_default;
    } else if (slash_with_default !== null) {
        const slash_with_default_names = get_names(p, slash_with_default.names_with_defaults);
        posonlyargs = slash_with_default.plain_names.concat(slash_with_default_names);
    }
    let posargs = [];
    if (plain_names !== null && names_with_default !== null) {
        const names_with_default_names = get_names(p, names_with_default);
        posargs = plain_names.concat(names_with_default_names);
    } else if (plain_names === null && names_with_default !== null) {
        posargs = get_names(p, names_with_default);
    } else if (plain_names !== null && names_with_default === null) {
        posargs = plain_names;
    }
    let posdefaults = [];
    if (slash_with_default !== null && names_with_default !== null) {
        const slash_with_default_values = get_defaults(p, slash_with_default.names_with_defaults);
        const names_with_default_values = get_defaults(p, names_with_default);
        posdefaults = slash_with_default_values.concat(names_with_default_values);
    } else if (slash_with_default === null && names_with_default !== null) {
        posdefaults = get_defaults(p, names_with_default);
    } else if (slash_with_default !== null && names_with_default === null) {
        posdefaults = get_defaults(p, slash_with_default.names_with_defaults);
    }
    let vararg = null;
    if (star_etc !== null && star_etc.vararg !== null) {
        vararg = star_etc.vararg;
    }
    let kwonlyargs = [];
    if (star_etc !== null && star_etc.kwonlyargs !== null) {
        kwonlyargs = get_names(p, star_etc.kwonlyargs);
    }
    let kwdefaults = [];
    if (star_etc !== null && star_etc.kwonlyargs !== null) {
        kwdefaults = get_defaults(p, star_etc.kwonlyargs);
    }
    let kwarg = null;
    if (star_etc !== null && star_etc.kwarg !== null) {
        kwarg = star_etc.kwarg;
    }
    return new arguments_(posonlyargs, posargs, vararg, kwonlyargs, kwdefaults, kwarg, posdefaults);
}
function empty_arguments(p) {
    return new arguments_([], [], null, [], [], null, []);
}
function function_def_decorators(p, decorators, fdef) {
    assert(fdef !== null);
    return new fdef.constructor(
        fdef.name,
        fdef.args,
        fdef.body,
        decorators,
        fdef.returns,
        fdef.type_comment,
        fdef.lineno,
        fdef.col_offset,
        fdef.end_lineno,
        fdef.end_col_offset
    );
}
function class_def_decorators(p, decorators, class_def) {
    assert(class_def !== null);
    return new ClassDef(
        class_def.name,
        class_def.bases,
        class_def.keywords,
        class_def.body,
        decorators,
        class_def.lineno,
        class_def.col_offset,
        class_def.end_lineno,
        class_def.end_col_offset
    );
}
function isKeyword(kw) {
    return kw.is_keyword;
}
function isStarred(kw) {
    return !kw.is_keyword;
}
function seq_extract_starred_exprs(p, kwargs) {
    return kwargs.filter(isStarred).map((kw) => kw.element);
}
function seq_delete_starred_exprs(p, kwargs) {
    return kwargs.filter(isKeyword).map((kw) => kw.element);
}
var encoder = new TextEncoder();
function concatenate_strings(p, tokens2) {
    const first = tokens2[0];
    const last = tokens2[tokens2.length - 1];
    const fstringParser = new FstringParser(p, first, last);
    let bytesmode = null;
    let bytestr = "";
    for (const t of tokens2) {
        const [s, fmode, this_bytesmode, rawmode] = parsestr(p, t);
        if (bytesmode !== null && bytesmode !== this_bytesmode) {
            p.raise_error(pySyntaxError, "cannot mix bytes and nonbytes literals");
        }
        bytesmode = this_bytesmode;
        if (fmode) {
            fstringParser.concatFstring(s, 0, s.length, rawmode, 0, t);
        } else if (bytesmode) {
            bytestr += s;
        } else {
            fstringParser.concat(s);
        }
    }
    if (bytesmode) {
        const [lineno, col_offset] = tokens2[0].start;
        const [end_lineno, end_col_offset] = tokens2[tokens2.length - 1].end;
        return new Constant(
            new pyBytes(encoder.encode(bytestr)),
            null,
            lineno,
            col_offset,
            end_lineno,
            end_col_offset
        );
    }
    return fstringParser.finish();
}
function make_module(p, a) {
    return new Module(a ?? [], []);
}
function get_invalid_target(e, targets_type) {
    if (e === null) {
        return null;
    }
    function _visit_container(container) {
        for (const other of container.elts) {
            const child = get_invalid_target(other, targets_type);
            if (child !== null) {
                return child;
            }
        }
        return null;
    }
    switch (e.constructor) {
        case List:
            return _visit_container(e);
        case Tuple:
            return _visit_container(e);
        case Starred:
            return get_invalid_target(e.value, targets_type);
        case Compare:
            if (targets_type == TARGETS_TYPE.FOR_TARGETS) {
                const cmpopVal = e.ops[0];
                if (cmpopVal === In) {
                    return get_invalid_target(e.left, targets_type);
                }
                return null;
            }
            return e;
        case Name2:
        case Subscript:
        case Attribute:
            return null;
        default:
            return e;
    }
}
function arguments_parsing_error(p, e) {
    let msg;
    if (e.keywords.some((k) => k.arg === null)) {
        msg = "positional argument follows keyword argument unpacking";
    } else {
        msg = "positional argument follows keyword argument";
    }
    return p.raise_error(pySyntaxError, msg);
}
function nonparen_genexp_in_call(p, c) {
    const args = c.args;
    if (args.length <= 1) {
        return null;
    }
    const { lineno, col_offset } = args[args.length - 1];
    return p.raise_error_known_location(
        pySyntaxError,
        lineno,
        col_offset + 1,
        "Generator expression must be parenthesized"
    );
}
function collect_call_seqs(p, a, b, ...attrs) {
    if (b === null) {
        return new Call(dummy_name(p), a, [], ...attrs);
    }
    const starreds = seq_extract_starred_exprs(p, b);
    const keywords = seq_delete_starred_exprs(p, b);
    const args = a.concat(starreds);
    return new Call(dummy_name(p), args, keywords, ...attrs);
}

// src/ast/constants.ts
var pyConstant = class {
    constructor(v) {
        this._v = v;
    }
    toString() {
        return String(this._v);
    }
    valueOf() {
        return this._v;
    }
    get [Symbol.toStringTag]() {
        return this.constructor._name;
    }
};
pyConstant._name = "constant";
var escape = { "\n": "n", "\r": "r", "	": "t", "\\": "\\", "'": "'", '"': '"' };
function _stringRepr(v) {
    let quote = "'";
    if (v.includes("'") && !v.includes('"')) {
        quote = '"';
    }
    const toEscape = new RegExp(`([\\n\\r\\\\	${quote}])`, "g");
    v = v.replace(toEscape, (_m, m1) => "\\" + escape[m1]);
    v = v.replace(/[\x00-\x1f]/g, (m) => "\\x" + m.charCodeAt(0).toString(16).padStart(2, "0"));
    return quote + v + quote;
}
var pyStr = class extends pyConstant {
    toString() {
        return _stringRepr(this._v);
    }
};
pyStr._name = "str";
var pyInt = class extends pyConstant {};
pyInt._name = "int";
var pyFloat = class extends pyConstant {
    toString() {
        const v = this._v;
        if ((v > 0 && v < 1e-4) || (v < 0 && v > -1e-4)) {
            return v.toExponential().replace(/(e[-+])([1-9])$/, "$10$2");
        } else {
            const ret = v.toString();
            return ret.includes(".") ? ret : ret + ".0";
        }
    }
};
pyFloat._name = "float";
var pyComplex = class extends pyConstant {
    constructor({ real = 0, imag }) {
        assert(real === 0);
        super({ real, imag });
    }
    toString() {
        const { imag } = this._v;
        return imag + "j";
    }
};
pyComplex._name = "complex";
var pyBytes = class extends pyConstant {
    toString() {
        return "b" + _stringRepr(new TextDecoder().decode(this._v));
    }
};
pyBytes._name = "bytes";
var pyNoneType = class extends pyConstant {
    toString() {
        return "None";
    }
};
pyNoneType._name = "NoneType";
var pyBool = class extends pyConstant {
    toString() {
        return this._v ? "True" : "False";
    }
};
pyBool._name = "bool";
var pyEllipsisType = class extends pyConstant {
    toString() {
        return "Ellipsis";
    }
};
pyEllipsisType._name = "ellipsis";
var pyNone = new pyNoneType(null);
var pyTrue = new pyBool(true);
var pyFalse = new pyBool(false);
var pyEllipsis = new pyEllipsisType("...");

// src/parser/parse_number.ts
var FLOAT_RE = new RegExp(Floatnumber);
function parsenumber(s) {
    s = s.replaceAll("_", "");
    const end = s[s.length - 1];
    if (end === "j" || end === "J") {
        return new pyComplex({ imag: parseFloat(s.slice(0, -1)) });
    }
    if (FLOAT_RE.test(s)) {
        return new pyFloat(parseFloat(s));
    }
    const val = Number(s);
    if (val > Number.MAX_SAFE_INTEGER) {
        const val2 = typeof BigInt === "undefined" ? JSBI.BigInt(s) : BigInt(s);
        return new pyInt(val2);
    }
    return new pyInt(val);
}

// src/parser/parser.ts
function logger(_target, _propertyKey, _descriptor) {}
function memoize(_target, propertyKey, descriptor) {
    const method = descriptor.value;
    function memoizeWrapper() {
        const mark = this._mark;
        const actionCache = this._cache[mark];
        const cached = actionCache.get(propertyKey);
        if (cached !== void 0) {
            this._mark = cached[1];
            return cached[0];
        }
        const tree = method.call(this);
        actionCache.set(propertyKey, [tree, this._mark]);
        return tree;
    }
    descriptor.value = memoizeWrapper;
}
function memoizeLeftRec(_target, propertyKey, descriptor) {
    const method = descriptor.value;
    function memoizeLeftRecWrapper() {
        const mark = this._mark;
        const actionCache = this._cache[mark];
        let cached = actionCache.get(propertyKey);
        if (cached !== void 0) {
            this._mark = cached[1];
            return cached[0];
        }
        let lastresult = null;
        let lastmark = mark;
        cached = [lastresult, lastmark];
        actionCache.set(propertyKey, cached);
        while (true) {
            this._mark = mark;
            const tree = method.call(this);
            if (tree === null) {
                this._mark = lastmark;
                break;
            }
            if (this._mark <= lastmark) {
                this._mark = lastmark;
                break;
            }
            cached[0] = lastresult = tree;
            cached[1] = lastmark = this._mark;
        }
        return lastresult;
    }
    descriptor.value = memoizeLeftRecWrapper;
}
var Parser = class {
    constructor(tokenizer) {
        this.type_ignore_comments = [];
        this._tok = tokenizer;
        this._mark = 0;
        this._cache = [new Map()];
        this._tokens = this._tok._tokens;
        this.filename = "<unknown>";
    }
    extra(start) {
        const START = this._tokens[start].start;
        let m = this._mark - 1;
        let END_TOKEN = this._tokens[m];
        while (m >= 0) {
            const type = END_TOKEN.type;
            if (type !== ENDMARKER && (type < NEWLINE || type > DEDENT)) {
                break;
            }
            END_TOKEN = this._tokens[--m];
        }
        const END = END_TOKEN.end;
        return [START[0], START[1], END[0], END[1]];
    }
    peek() {
        if (this._mark === this._tokens.length) {
            this._cache.push(new Map());
            return this._tok.getnext();
        }
        return this._tokens[this._mark];
    }
    diagnose() {
        if (this._tokens.length === 0) {
            this.peek();
        }
        return this._tokens[this._tokens.length - 1];
    }
    raise_error(errType, msg, ...formatArgs) {
        const tok = this.diagnose();
        return this.raise_error_known_location(errType, tok.start[0], tok.start[1] + 1, msg, ...formatArgs);
    }
    raise_error_known_location(errType, lineno, offset, msg, ...formatArgs) {
        if (this.start_rule === StartRule.FSTRING_INPUT) {
            msg = "f-string: " + msg;
        }
        for (const arg2 of formatArgs) {
            msg = msg.replace("%s", arg2);
        }
        let tok = this.diagnose();
        let i = this._tokens.length - 1;
        while (tok.lineno !== lineno && i > 0) {
            tok = this._tokens[--i];
        }
        throw new errType(msg, [this.filename, lineno, offset, tok.line]);
    }
    raise_error_invalid_target(type, e) {
        const invalidTarget = get_invalid_target(e, type);
        if (invalidTarget !== null) {
            const msg =
                type === TARGETS_TYPE.STAR_TARGETS || type === TARGETS_TYPE.FOR_TARGETS
                    ? "cannot assign to %s"
                    : "cannot delete %s";
            return this.raise_error_known_location(
                pySyntaxError,
                invalidTarget.lineno,
                invalidTarget.col_offset,
                msg,
                get_expr_name(invalidTarget)
            );
        }
        return this.raise_error(pySyntaxError, "invalid syntax");
    }
    name() {
        const tok = this.peek();
        if (tok.type === NAME && !KEYWORDS.has(tok.string)) {
            this._mark++;
            return new Name2(tok.string, Load, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    string() {
        const tok = this.peek();
        if (tok.type === STRING) {
            this._mark++;
            return tok;
        }
        return null;
    }
    number() {
        const tok = this.peek();
        if (tok.type === NUMBER) {
            this._mark++;
            return new Constant(parsenumber(tok.string), null, tok.start[0], tok.start[1], tok.end[0], tok.end[1]);
        }
        return null;
    }
    keyword(word) {
        const tok = this.peek();
        if (tok.string === word) {
            this._mark++;
            return tok;
        } else {
            return null;
        }
    }
    expect(type) {
        const tok = this.peek();
        if (type === tok.type) {
            this._mark++;
            return tok;
        }
        return null;
    }
    positive_lookahead(func, arg2) {
        const mark = this._mark;
        const ok = func.call(this, arg2);
        this._mark = mark;
        return ok;
    }
    negative_lookahead(func, arg2) {
        const mark = this._mark;
        const ok = func.call(this, arg2);
        this._mark = mark;
        return !ok;
    }
    make_syntax_error() {
        const tok = this.diagnose();
        const { type: lastTokenType } = tok;
        if (lastTokenType === INDENT) {
            this.raise_error(pyIndentationError, "unexpected indent");
        } else if (lastTokenType === DEDENT) {
            this.raise_error(pyIndentationError, "unexpected unindent");
        }
        throw this.raise_error(pySyntaxError, "invalid syntax");
    }
};

// src/parser/generated_parser.ts
function CHECK(...args) {
    return args[0];
}
function CHECK_VERSION(i, msg, ret) {
    return ret;
}
function CHECK_NULL_ALLOWED(result) {
    return result;
}
var GeneratedParser = class extends Parser {
    constructor(T, start_rule = StartRule.FILE_INPUT, flags = 0) {
        super(T);
        this.start_rule = start_rule;
        this.flags = flags;
    }
    parse() {
        let ret = null;
        switch (this.start_rule) {
            case StartRule.FILE_INPUT:
                ret = this.file();
                break;
            case StartRule.SINGLE_INPUT:
                ret = this.interactive();
                break;
            case StartRule.EVAL_INPUT:
                ret = this.eval();
                break;
            case StartRule.FUNC_TYPE_INPUT:
                ret = this.func_type();
                break;
            case StartRule.FSTRING_INPUT:
                ret = this.fstring();
                break;
        }
        if (ret === null) {
            return this.make_syntax_error();
        }
        this._cache.length = 1;
        this._mark = 0;
        return ret;
    }
    file() {
        let a, endmarker;
        const mark = this._mark;
        if (((a = this.statements()), 1) && (endmarker = this.expect(0))) {
            return make_module(this, a);
        }
        this._mark = mark;
        return null;
    }
    interactive() {
        let a;
        const mark = this._mark;
        if ((a = this.statement_newline())) {
            return new Interactive(a);
        }
        this._mark = mark;
        return null;
    }
    eval() {
        let _loop0_1, a, endmarker;
        const mark = this._mark;
        if ((a = this.expressions()) && (_loop0_1 = this._loop0_1()) && (endmarker = this.expect(0))) {
            return new Expression(a);
        }
        this._mark = mark;
        return null;
    }
    func_type() {
        let _loop0_2, a, b, endmarker, literal, literal_1, literal_2;
        const mark = this._mark;
        if (
            (literal = this.expect(7)) &&
            ((a = this.type_expressions()), 1) &&
            (literal_1 = this.expect(8)) &&
            (literal_2 = this.expect(51)) &&
            (b = this.expression()) &&
            (_loop0_2 = this._loop0_2()) &&
            (endmarker = this.expect(0))
        ) {
            return new FunctionType(a, b);
        }
        this._mark = mark;
        return null;
    }
    fstring() {
        let star_expressions;
        const mark = this._mark;
        if ((star_expressions = this.star_expressions())) {
            return star_expressions;
        }
        this._mark = mark;
        return null;
    }
    type_expressions() {
        let _gather_9, a, b, c, literal, literal_1, literal_2, literal_3;
        const mark = this._mark;
        if (
            (a = this._gather_3()) &&
            (literal = this.expect(12)) &&
            (literal_1 = this.expect(16)) &&
            (b = this.expression()) &&
            (literal_2 = this.expect(12)) &&
            (literal_3 = this.expect(35)) &&
            (c = this.expression())
        ) {
            return seq_append_to_end(this, CHECK(seq_append_to_end(this, a, b)), c);
        }
        this._mark = mark;
        if (
            (a = this._gather_5()) &&
            (literal = this.expect(12)) &&
            (literal_1 = this.expect(16)) &&
            (b = this.expression())
        ) {
            return seq_append_to_end(this, a, b);
        }
        this._mark = mark;
        if (
            (a = this._gather_7()) &&
            (literal = this.expect(12)) &&
            (literal_1 = this.expect(35)) &&
            (b = this.expression())
        ) {
            return seq_append_to_end(this, a, b);
        }
        this._mark = mark;
        if (
            (literal = this.expect(16)) &&
            (a = this.expression()) &&
            (literal_1 = this.expect(12)) &&
            (literal_2 = this.expect(35)) &&
            (b = this.expression())
        ) {
            return seq_append_to_end(this, CHECK(singleton_seq(this, a)), b);
        }
        this._mark = mark;
        if ((literal = this.expect(16)) && (a = this.expression())) {
            return singleton_seq(this, a);
        }
        this._mark = mark;
        if ((literal = this.expect(35)) && (a = this.expression())) {
            return singleton_seq(this, a);
        }
        this._mark = mark;
        if ((_gather_9 = this._gather_9())) {
            return _gather_9;
        }
        this._mark = mark;
        return null;
    }
    statements() {
        let a;
        const mark = this._mark;
        if ((a = this._loop1_11())) {
            return seq_flatten(this, a);
        }
        this._mark = mark;
        return null;
    }
    statement() {
        let a, simple_stmt;
        const mark = this._mark;
        if ((a = this.compound_stmt())) {
            return singleton_seq(this, a);
        }
        this._mark = mark;
        if ((simple_stmt = this.simple_stmt())) {
            return simple_stmt;
        }
        this._mark = mark;
        return null;
    }
    statement_newline() {
        let a, endmarker, newline, simple_stmt;
        const mark = this._mark;
        if ((a = this.compound_stmt()) && (newline = this.expect(4))) {
            return singleton_seq(this, a);
        }
        this._mark = mark;
        if ((simple_stmt = this.simple_stmt())) {
            return simple_stmt;
        }
        this._mark = mark;
        if ((newline = this.expect(4))) {
            const EXTRA = this.extra(mark);
            return singleton_seq(this, CHECK(new Pass(...EXTRA)));
        }
        this._mark = mark;
        if ((endmarker = this.expect(0))) {
            return interactive_exit(this);
        }
        this._mark = mark;
        return null;
    }
    simple_stmt() {
        let a, newline, opt;
        const mark = this._mark;
        if ((a = this.small_stmt()) && this.negative_lookahead(this.expect, 13) && (newline = this.expect(4))) {
            return singleton_seq(this, a);
        }
        this._mark = mark;
        if ((a = this._gather_12()) && ((opt = this.expect(13)), 1) && (newline = this.expect(4))) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    small_stmt() {
        let assert_stmt,
            assignment,
            del_stmt,
            e,
            global_stmt,
            import_stmt,
            keyword3,
            nonlocal_stmt,
            raise_stmt,
            return_stmt,
            yield_stmt;
        const mark = this._mark;
        if ((assignment = this.assignment())) {
            return assignment;
        }
        this._mark = mark;
        if ((e = this.star_expressions())) {
            const EXTRA = this.extra(mark);
            return new Expr(e, ...EXTRA);
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "return") && (return_stmt = this.return_stmt())) {
            return return_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this._tmp_14) && (import_stmt = this.import_stmt())) {
            return import_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "raise") && (raise_stmt = this.raise_stmt())) {
            return raise_stmt;
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("pass"))) {
            const EXTRA = this.extra(mark);
            return new Pass(...EXTRA);
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "del") && (del_stmt = this.del_stmt())) {
            return del_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "yield") && (yield_stmt = this.yield_stmt())) {
            return yield_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "assert") && (assert_stmt = this.assert_stmt())) {
            return assert_stmt;
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("break"))) {
            const EXTRA = this.extra(mark);
            return new Break(...EXTRA);
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("continue"))) {
            const EXTRA = this.extra(mark);
            return new Continue(...EXTRA);
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "global") && (global_stmt = this.global_stmt())) {
            return global_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "nonlocal") && (nonlocal_stmt = this.nonlocal_stmt())) {
            return nonlocal_stmt;
        }
        this._mark = mark;
        return null;
    }
    compound_stmt() {
        let class_def, for_stmt, function_def, if_stmt, try_stmt, while_stmt, with_stmt;
        const mark = this._mark;
        if (this.positive_lookahead(this._tmp_15) && (function_def = this.function_def())) {
            return function_def;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "if") && (if_stmt = this.if_stmt())) {
            return if_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this._tmp_16) && (class_def = this.class_def())) {
            return class_def;
        }
        this._mark = mark;
        if (this.positive_lookahead(this._tmp_17) && (with_stmt = this.with_stmt())) {
            return with_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this._tmp_18) && (for_stmt = this.for_stmt())) {
            return for_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "try") && (try_stmt = this.try_stmt())) {
            return try_stmt;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.keyword, "while") && (while_stmt = this.while_stmt())) {
            return while_stmt;
        }
        this._mark = mark;
        return null;
    }
    assignment() {
        let a, b, c, invalid_assignment, literal, tc;
        let cut = false;
        const mark = this._mark;
        if ((a = this.name()) && (literal = this.expect(11)) && (b = this.expression()) && ((c = this._tmp_19()), 1)) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(
                6,
                "Variable annotation syntax is",
                new AnnAssign(CHECK(set_expr_context(this, a, Store)), b, c, 1, ...EXTRA)
            );
        }
        this._mark = mark;
        if (
            (a = this._tmp_20()) &&
            (literal = this.expect(11)) &&
            (b = this.expression()) &&
            ((c = this._tmp_21()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(6, "Variable annotations syntax is", new AnnAssign(a, b, c, 0, ...EXTRA));
        }
        this._mark = mark;
        if (
            (a = this._loop1_22()) &&
            (b = this._tmp_23()) &&
            this.negative_lookahead(this.expect, 22) &&
            ((tc = this.expect(58)), 1)
        ) {
            const EXTRA = this.extra(mark);
            return new Assign(a, b, NEW_TYPE_COMMENT(this, tc), ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.single_target()) && (b = this.augassign()) && (cut = true) && (c = this._tmp_24())) {
            const EXTRA = this.extra(mark);
            return new AugAssign(a, b.kind, c, ...EXTRA);
        }
        this._mark = mark;
        if (cut) return null;
        if ((invalid_assignment = this.invalid_assignment())) {
            return invalid_assignment;
        }
        this._mark = mark;
        return null;
    }
    augassign() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(36))) {
            return new AugOperator(Add);
        }
        this._mark = mark;
        if ((literal = this.expect(37))) {
            return new AugOperator(Sub);
        }
        this._mark = mark;
        if ((literal = this.expect(38))) {
            return new AugOperator(Mult);
        }
        this._mark = mark;
        if ((literal = this.expect(50))) {
            return CHECK_VERSION(5, "The '@' operator is", new AugOperator(MatMult));
        }
        this._mark = mark;
        if ((literal = this.expect(39))) {
            return new AugOperator(Div);
        }
        this._mark = mark;
        if ((literal = this.expect(40))) {
            return new AugOperator(Mod);
        }
        this._mark = mark;
        if ((literal = this.expect(41))) {
            return new AugOperator(BitAnd);
        }
        this._mark = mark;
        if ((literal = this.expect(42))) {
            return new AugOperator(BitOr);
        }
        this._mark = mark;
        if ((literal = this.expect(43))) {
            return new AugOperator(BitXor);
        }
        this._mark = mark;
        if ((literal = this.expect(44))) {
            return new AugOperator(LShift);
        }
        this._mark = mark;
        if ((literal = this.expect(45))) {
            return new AugOperator(RShift);
        }
        this._mark = mark;
        if ((literal = this.expect(46))) {
            return new AugOperator(Pow);
        }
        this._mark = mark;
        if ((literal = this.expect(48))) {
            return new AugOperator(FloorDiv);
        }
        this._mark = mark;
        return null;
    }
    global_stmt() {
        let a, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("global")) && (a = this._gather_25())) {
            const EXTRA = this.extra(mark);
            return new Global(CHECK(map_names_to_ids(this, a)), ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    nonlocal_stmt() {
        let a, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("nonlocal")) && (a = this._gather_27())) {
            const EXTRA = this.extra(mark);
            return new Nonlocal(CHECK(map_names_to_ids(this, a)), ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    yield_stmt() {
        let y;
        const mark = this._mark;
        if ((y = this.yield_expr())) {
            const EXTRA = this.extra(mark);
            return new Expr(y, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    assert_stmt() {
        let a, b, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("assert")) && (a = this.expression()) && ((b = this._tmp_29()), 1)) {
            const EXTRA = this.extra(mark);
            return new Assert(a, b, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    del_stmt() {
        let a, invalid_del_stmt, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("del")) && (a = this.del_targets()) && this.positive_lookahead(this._tmp_30)) {
            const EXTRA = this.extra(mark);
            return new Delete(a, ...EXTRA);
        }
        this._mark = mark;
        if ((invalid_del_stmt = this.invalid_del_stmt())) {
            return invalid_del_stmt;
        }
        this._mark = mark;
        return null;
    }
    import_stmt() {
        let import_from, import_name;
        const mark = this._mark;
        if ((import_name = this.import_name())) {
            return import_name;
        }
        this._mark = mark;
        if ((import_from = this.import_from())) {
            return import_from;
        }
        this._mark = mark;
        return null;
    }
    import_name() {
        let a, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("import")) && (a = this.dotted_as_names())) {
            const EXTRA = this.extra(mark);
            return new Import(a, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    import_from() {
        let a, b, c, keyword3, keyword_1;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("from")) &&
            (a = this._loop0_31()) &&
            (b = this.dotted_name()) &&
            (keyword_1 = this.keyword("import")) &&
            (c = this.import_from_targets())
        ) {
            const EXTRA = this.extra(mark);
            return new ImportFrom(b.id, c, seq_count_dots(a), ...EXTRA);
        }
        this._mark = mark;
        if (
            (keyword3 = this.keyword("from")) &&
            (a = this._loop1_32()) &&
            (keyword_1 = this.keyword("import")) &&
            (b = this.import_from_targets())
        ) {
            const EXTRA = this.extra(mark);
            return new ImportFrom(null, b, seq_count_dots(a), ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    import_from_targets() {
        let a, import_from_as_names, invalid_import_from_targets, literal, literal_1, opt;
        const mark = this._mark;
        if (
            (literal = this.expect(7)) &&
            (a = this.import_from_as_names()) &&
            ((opt = this.expect(12)), 1) &&
            (literal_1 = this.expect(8))
        ) {
            return a;
        }
        this._mark = mark;
        if ((import_from_as_names = this.import_from_as_names()) && this.negative_lookahead(this.expect, 12)) {
            return import_from_as_names;
        }
        this._mark = mark;
        if ((literal = this.expect(16))) {
            return singleton_seq(this, CHECK(alias_for_star(this)));
        }
        this._mark = mark;
        if ((invalid_import_from_targets = this.invalid_import_from_targets())) {
            return invalid_import_from_targets;
        }
        this._mark = mark;
        return null;
    }
    import_from_as_names() {
        let a;
        const mark = this._mark;
        if ((a = this._gather_33())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    import_from_as_name() {
        let a, b;
        const mark = this._mark;
        if ((a = this.name()) && ((b = this._tmp_35()), 1)) {
            return new alias(a.id, b ? b.id : null);
        }
        this._mark = mark;
        return null;
    }
    dotted_as_names() {
        let a;
        const mark = this._mark;
        if ((a = this._gather_36())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    dotted_as_name() {
        let a, b;
        const mark = this._mark;
        if ((a = this.dotted_name()) && ((b = this._tmp_38()), 1)) {
            return new alias(a.id, b ? b.id : null);
        }
        this._mark = mark;
        return null;
    }
    dotted_name() {
        let a, b, literal, name;
        const mark = this._mark;
        if ((a = this.dotted_name()) && (literal = this.expect(23)) && (b = this.name())) {
            return join_names_with_dot(this, a, b);
        }
        this._mark = mark;
        if ((name = this.name())) {
            return name;
        }
        this._mark = mark;
        return null;
    }
    if_stmt() {
        let a, b, c, keyword3, literal;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("if")) &&
            (a = this.named_expression()) &&
            (literal = this.expect(11)) &&
            (b = this.block()) &&
            (c = this.elif_stmt())
        ) {
            const EXTRA = this.extra(mark);
            return new If(a, b, CHECK(singleton_seq(this, c)), ...EXTRA);
        }
        this._mark = mark;
        if (
            (keyword3 = this.keyword("if")) &&
            (a = this.named_expression()) &&
            (literal = this.expect(11)) &&
            (b = this.block()) &&
            ((c = this.else_block()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return new If(a, b, c, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    elif_stmt() {
        let a, b, c, keyword3, literal;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("elif")) &&
            (a = this.named_expression()) &&
            (literal = this.expect(11)) &&
            (b = this.block()) &&
            (c = this.elif_stmt())
        ) {
            const EXTRA = this.extra(mark);
            return new If(a, b, CHECK(singleton_seq(this, c)), ...EXTRA);
        }
        this._mark = mark;
        if (
            (keyword3 = this.keyword("elif")) &&
            (a = this.named_expression()) &&
            (literal = this.expect(11)) &&
            (b = this.block()) &&
            ((c = this.else_block()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return new If(a, b, c, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    else_block() {
        let b, keyword3, literal;
        const mark = this._mark;
        if ((keyword3 = this.keyword("else")) && (literal = this.expect(11)) && (b = this.block())) {
            return b;
        }
        this._mark = mark;
        return null;
    }
    while_stmt() {
        let a, b, c, keyword3, literal;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("while")) &&
            (a = this.named_expression()) &&
            (literal = this.expect(11)) &&
            (b = this.block()) &&
            ((c = this.else_block()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return new While(a, b, c, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    for_stmt() {
        let async, b, el, ex, invalid_for_target, keyword3, keyword_1, literal, t, tc;
        let cut = false;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("for")) &&
            (t = this.star_targets()) &&
            (keyword_1 = this.keyword("in")) &&
            (cut = true) &&
            (ex = this.star_expressions()) &&
            (literal = this.expect(11)) &&
            ((tc = this.expect(58)), 1) &&
            (b = this.block()) &&
            ((el = this.else_block()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return new For(t, ex, b, el, NEW_TYPE_COMMENT(this, tc), ...EXTRA);
        }
        this._mark = mark;
        if (cut) return null;
        if (
            (async = this.expect(56)) &&
            (keyword3 = this.keyword("for")) &&
            (t = this.star_targets()) &&
            (keyword_1 = this.keyword("in")) &&
            (cut = true) &&
            (ex = this.star_expressions()) &&
            (literal = this.expect(11)) &&
            ((tc = this.expect(58)), 1) &&
            (b = this.block()) &&
            ((el = this.else_block()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(
                5,
                "Async for loops are",
                new AsyncFor(t, ex, b, el, NEW_TYPE_COMMENT(this, tc), ...EXTRA)
            );
        }
        this._mark = mark;
        if (cut) return null;
        if ((invalid_for_target = this.invalid_for_target())) {
            return invalid_for_target;
        }
        this._mark = mark;
        return null;
    }
    with_stmt() {
        let a, async, b, keyword3, literal, literal_1, literal_2, opt, tc;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("with")) &&
            (literal = this.expect(7)) &&
            (a = this._gather_39()) &&
            ((opt = this.expect(12)), 1) &&
            (literal_1 = this.expect(8)) &&
            (literal_2 = this.expect(11)) &&
            (b = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return new With(a, b, null, ...EXTRA);
        }
        this._mark = mark;
        if (
            (keyword3 = this.keyword("with")) &&
            (a = this._gather_41()) &&
            (literal = this.expect(11)) &&
            ((tc = this.expect(58)), 1) &&
            (b = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return new With(a, b, NEW_TYPE_COMMENT(this, tc), ...EXTRA);
        }
        this._mark = mark;
        if (
            (async = this.expect(56)) &&
            (keyword3 = this.keyword("with")) &&
            (literal = this.expect(7)) &&
            (a = this._gather_43()) &&
            ((opt = this.expect(12)), 1) &&
            (literal_1 = this.expect(8)) &&
            (literal_2 = this.expect(11)) &&
            (b = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(5, "Async with statements are", new AsyncWith(a, b, null, ...EXTRA));
        }
        this._mark = mark;
        if (
            (async = this.expect(56)) &&
            (keyword3 = this.keyword("with")) &&
            (a = this._gather_45()) &&
            (literal = this.expect(11)) &&
            ((tc = this.expect(58)), 1) &&
            (b = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(
                5,
                "Async with statements are",
                new AsyncWith(a, b, NEW_TYPE_COMMENT(this, tc), ...EXTRA)
            );
        }
        this._mark = mark;
        return null;
    }
    with_item() {
        let e, invalid_with_item, keyword3, t;
        const mark = this._mark;
        if (
            (e = this.expression()) &&
            (keyword3 = this.keyword("as")) &&
            (t = this.star_target()) &&
            this.positive_lookahead(this._tmp_47)
        ) {
            return new withitem(e, t);
        }
        this._mark = mark;
        if ((invalid_with_item = this.invalid_with_item())) {
            return invalid_with_item;
        }
        this._mark = mark;
        if ((e = this.expression())) {
            return new withitem(e, null);
        }
        this._mark = mark;
        return null;
    }
    try_stmt() {
        let b, el, ex, f, keyword3, literal;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("try")) &&
            (literal = this.expect(11)) &&
            (b = this.block()) &&
            (f = this.finally_block())
        ) {
            const EXTRA = this.extra(mark);
            return new Try(b, null, null, f, ...EXTRA);
        }
        this._mark = mark;
        if (
            (keyword3 = this.keyword("try")) &&
            (literal = this.expect(11)) &&
            (b = this.block()) &&
            (ex = this._loop1_48()) &&
            ((el = this.else_block()), 1) &&
            ((f = this.finally_block()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return new Try(b, ex, el, f, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    except_block() {
        let b, e, keyword3, literal, t;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("except")) &&
            (e = this.expression()) &&
            ((t = this._tmp_49()), 1) &&
            (literal = this.expect(11)) &&
            (b = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return new ExceptHandler(e, t ? t.id : null, b, ...EXTRA);
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("except")) && (literal = this.expect(11)) && (b = this.block())) {
            const EXTRA = this.extra(mark);
            return new ExceptHandler(null, null, b, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    finally_block() {
        let a, keyword3, literal;
        const mark = this._mark;
        if ((keyword3 = this.keyword("finally")) && (literal = this.expect(11)) && (a = this.block())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    return_stmt() {
        let a, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("return")) && ((a = this.star_expressions()), 1)) {
            const EXTRA = this.extra(mark);
            return new Return(a, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    raise_stmt() {
        let a, b, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("raise")) && (a = this.expression()) && ((b = this._tmp_50()), 1)) {
            const EXTRA = this.extra(mark);
            return new Raise(a, b, ...EXTRA);
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("raise"))) {
            const EXTRA = this.extra(mark);
            return new Raise(null, null, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    function_def() {
        let d, f, function_def_raw;
        const mark = this._mark;
        if ((d = this.decorators()) && (f = this.function_def_raw())) {
            return function_def_decorators(this, d, f);
        }
        this._mark = mark;
        if ((function_def_raw = this.function_def_raw())) {
            return function_def_raw;
        }
        this._mark = mark;
        return null;
    }
    function_def_raw() {
        let a, async, b, keyword3, literal, literal_1, literal_2, n, params, tc;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("def")) &&
            (n = this.name()) &&
            (literal = this.expect(7)) &&
            ((params = this.params()), 1) &&
            (literal_1 = this.expect(8)) &&
            ((a = this._tmp_51()), 1) &&
            (literal_2 = this.expect(11)) &&
            ((tc = this.func_type_comment()), 1) &&
            (b = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return new FunctionDef(
                n.id,
                params ? params : CHECK(empty_arguments(this)),
                b,
                null,
                a,
                NEW_TYPE_COMMENT(this, tc),
                ...EXTRA
            );
        }
        this._mark = mark;
        if (
            (async = this.expect(56)) &&
            (keyword3 = this.keyword("def")) &&
            (n = this.name()) &&
            (literal = this.expect(7)) &&
            ((params = this.params()), 1) &&
            (literal_1 = this.expect(8)) &&
            ((a = this._tmp_52()), 1) &&
            (literal_2 = this.expect(11)) &&
            ((tc = this.func_type_comment()), 1) &&
            (b = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(
                5,
                "Async functions are",
                new AsyncFunctionDef(
                    n.id,
                    params ? params : CHECK(empty_arguments(this)),
                    b,
                    null,
                    a,
                    NEW_TYPE_COMMENT(this, tc),
                    ...EXTRA
                )
            );
        }
        this._mark = mark;
        return null;
    }
    func_type_comment() {
        let invalid_double_type_comments, newline, t, type_comment;
        const mark = this._mark;
        if ((newline = this.expect(4)) && (t = this.expect(58)) && this.positive_lookahead(this._tmp_53)) {
            return t;
        }
        this._mark = mark;
        if ((invalid_double_type_comments = this.invalid_double_type_comments())) {
            return invalid_double_type_comments;
        }
        this._mark = mark;
        if ((type_comment = this.expect(58))) {
            return type_comment;
        }
        this._mark = mark;
        return null;
    }
    params() {
        let invalid_parameters, parameters;
        const mark = this._mark;
        if ((invalid_parameters = this.invalid_parameters())) {
            return invalid_parameters;
        }
        this._mark = mark;
        if ((parameters = this.parameters())) {
            return parameters;
        }
        this._mark = mark;
        return null;
    }
    parameters() {
        let a, b, c, d;
        const mark = this._mark;
        if (
            (a = this.slash_no_default()) &&
            (b = this._loop0_54()) &&
            (c = this._loop0_55()) &&
            ((d = this.star_etc()), 1)
        ) {
            return make_arguments(this, a, null, b, c, d);
        }
        this._mark = mark;
        if ((a = this.slash_with_default()) && (b = this._loop0_56()) && ((c = this.star_etc()), 1)) {
            return make_arguments(this, null, a, null, b, c);
        }
        this._mark = mark;
        if ((a = this._loop1_57()) && (b = this._loop0_58()) && ((c = this.star_etc()), 1)) {
            return make_arguments(this, null, null, a, b, c);
        }
        this._mark = mark;
        if ((a = this._loop1_59()) && ((b = this.star_etc()), 1)) {
            return make_arguments(this, null, null, null, a, b);
        }
        this._mark = mark;
        if ((a = this.star_etc())) {
            return make_arguments(this, null, null, null, null, a);
        }
        this._mark = mark;
        return null;
    }
    slash_no_default() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((a = this._loop1_60()) && (literal = this.expect(17)) && (literal_1 = this.expect(12))) {
            return a;
        }
        this._mark = mark;
        if ((a = this._loop1_61()) && (literal = this.expect(17)) && this.positive_lookahead(this.expect, 8)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    slash_with_default() {
        let a, b, literal, literal_1;
        const mark = this._mark;
        if (
            (a = this._loop0_62()) &&
            (b = this._loop1_63()) &&
            (literal = this.expect(17)) &&
            (literal_1 = this.expect(12))
        ) {
            return new SlashWithDefault(a, b);
        }
        this._mark = mark;
        if (
            (a = this._loop0_64()) &&
            (b = this._loop1_65()) &&
            (literal = this.expect(17)) &&
            this.positive_lookahead(this.expect, 8)
        ) {
            return new SlashWithDefault(a, b);
        }
        this._mark = mark;
        return null;
    }
    star_etc() {
        let a, b, c, invalid_star_etc, literal, literal_1;
        const mark = this._mark;
        if (
            (literal = this.expect(16)) &&
            (a = this.param_no_default()) &&
            (b = this._loop0_66()) &&
            ((c = this.kwds()), 1)
        ) {
            return new StarEtc(a, b, c);
        }
        this._mark = mark;
        if (
            (literal = this.expect(16)) &&
            (literal_1 = this.expect(12)) &&
            (b = this._loop1_67()) &&
            ((c = this.kwds()), 1)
        ) {
            return new StarEtc(null, b, c);
        }
        this._mark = mark;
        if ((a = this.kwds())) {
            return new StarEtc(null, null, a);
        }
        this._mark = mark;
        if ((invalid_star_etc = this.invalid_star_etc())) {
            return invalid_star_etc;
        }
        this._mark = mark;
        return null;
    }
    kwds() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(35)) && (a = this.param_no_default())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    param_no_default() {
        let a, literal, tc;
        const mark = this._mark;
        if ((a = this.param()) && (literal = this.expect(12)) && ((tc = this.expect(58)), 1)) {
            return add_type_comment_to_arg(this, a, tc);
        }
        this._mark = mark;
        if ((a = this.param()) && ((tc = this.expect(58)), 1) && this.positive_lookahead(this.expect, 8)) {
            return add_type_comment_to_arg(this, a, tc);
        }
        this._mark = mark;
        return null;
    }
    param_with_default() {
        let a, c, literal, tc;
        const mark = this._mark;
        if ((a = this.param()) && (c = this.default()) && (literal = this.expect(12)) && ((tc = this.expect(58)), 1)) {
            return name_default_pair(this, a, c, tc);
        }
        this._mark = mark;
        if (
            (a = this.param()) &&
            (c = this.default()) &&
            ((tc = this.expect(58)), 1) &&
            this.positive_lookahead(this.expect, 8)
        ) {
            return name_default_pair(this, a, c, tc);
        }
        this._mark = mark;
        return null;
    }
    param_maybe_default() {
        let a, c, literal, tc;
        const mark = this._mark;
        if (
            (a = this.param()) &&
            ((c = this.default()), 1) &&
            (literal = this.expect(12)) &&
            ((tc = this.expect(58)), 1)
        ) {
            return name_default_pair(this, a, c, tc);
        }
        this._mark = mark;
        if (
            (a = this.param()) &&
            ((c = this.default()), 1) &&
            ((tc = this.expect(58)), 1) &&
            this.positive_lookahead(this.expect, 8)
        ) {
            return name_default_pair(this, a, c, tc);
        }
        this._mark = mark;
        return null;
    }
    param() {
        let a, b;
        const mark = this._mark;
        if ((a = this.name()) && ((b = this.annotation()), 1)) {
            const EXTRA = this.extra(mark);
            return new arg(a.id, b, null, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    annotation() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(11)) && (a = this.expression())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    default() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(22)) && (a = this.expression())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    decorators() {
        let a;
        const mark = this._mark;
        if ((a = this._loop1_68())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    class_def() {
        let a, b, class_def_raw;
        const mark = this._mark;
        if ((a = this.decorators()) && (b = this.class_def_raw())) {
            return class_def_decorators(this, a, b);
        }
        this._mark = mark;
        if ((class_def_raw = this.class_def_raw())) {
            return class_def_raw;
        }
        this._mark = mark;
        return null;
    }
    class_def_raw() {
        let a, b, c, keyword3, literal;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("class")) &&
            (a = this.name()) &&
            ((b = this._tmp_69()), 1) &&
            (literal = this.expect(11)) &&
            (c = this.block())
        ) {
            const EXTRA = this.extra(mark);
            return new ClassDef(a.id, b ? b.args : null, b ? b.keywords : null, c, null, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    block() {
        let a, dedent, indent, invalid_block, newline, simple_stmt;
        const mark = this._mark;
        if (
            (newline = this.expect(4)) &&
            (indent = this.expect(5)) &&
            (a = this.statements()) &&
            (dedent = this.expect(6))
        ) {
            return a;
        }
        this._mark = mark;
        if ((simple_stmt = this.simple_stmt())) {
            return simple_stmt;
        }
        this._mark = mark;
        if ((invalid_block = this.invalid_block())) {
            return invalid_block;
        }
        this._mark = mark;
        return null;
    }
    star_expressions() {
        let a, b, literal, opt, star_expression;
        const mark = this._mark;
        if ((a = this.star_expression()) && (b = this._loop1_70()) && ((opt = this.expect(12)), 1)) {
            const EXTRA = this.extra(mark);
            return new Tuple(CHECK(seq_insert_in_front(this, a, b)), Load, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.star_expression()) && (literal = this.expect(12))) {
            const EXTRA = this.extra(mark);
            return new Tuple(CHECK(singleton_seq(this, a)), Load, ...EXTRA);
        }
        this._mark = mark;
        if ((star_expression = this.star_expression())) {
            return star_expression;
        }
        this._mark = mark;
        return null;
    }
    star_expression() {
        let a, expression, literal;
        const mark = this._mark;
        if ((literal = this.expect(16)) && (a = this.bitwise_or())) {
            const EXTRA = this.extra(mark);
            return new Starred(a, Load, ...EXTRA);
        }
        this._mark = mark;
        if ((expression = this.expression())) {
            return expression;
        }
        this._mark = mark;
        return null;
    }
    star_named_expressions() {
        let a, opt;
        const mark = this._mark;
        if ((a = this._gather_71()) && ((opt = this.expect(12)), 1)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    star_named_expression() {
        let a, literal, named_expression;
        const mark = this._mark;
        if ((literal = this.expect(16)) && (a = this.bitwise_or())) {
            const EXTRA = this.extra(mark);
            return new Starred(a, Load, ...EXTRA);
        }
        this._mark = mark;
        if ((named_expression = this.named_expression())) {
            return named_expression;
        }
        this._mark = mark;
        return null;
    }
    named_expression() {
        let a, b, expression, invalid_named_expression, literal;
        let cut = false;
        const mark = this._mark;
        if ((a = this.name()) && (literal = this.expect(53)) && (cut = true) && (b = this.expression())) {
            const EXTRA = this.extra(mark);
            return new NamedExpr(CHECK(set_expr_context(this, a, Store)), b, ...EXTRA);
        }
        this._mark = mark;
        if (cut) return null;
        if ((expression = this.expression()) && this.negative_lookahead(this.expect, 53)) {
            return expression;
        }
        this._mark = mark;
        if ((invalid_named_expression = this.invalid_named_expression())) {
            return invalid_named_expression;
        }
        this._mark = mark;
        return null;
    }
    annotated_rhs() {
        let star_expressions, yield_expr;
        const mark = this._mark;
        if ((yield_expr = this.yield_expr())) {
            return yield_expr;
        }
        this._mark = mark;
        if ((star_expressions = this.star_expressions())) {
            return star_expressions;
        }
        this._mark = mark;
        return null;
    }
    expressions() {
        let a, b, expression, literal, opt;
        const mark = this._mark;
        if ((a = this.expression()) && (b = this._loop1_73()) && ((opt = this.expect(12)), 1)) {
            const EXTRA = this.extra(mark);
            return new Tuple(CHECK(seq_insert_in_front(this, a, b)), Load, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.expression()) && (literal = this.expect(12))) {
            const EXTRA = this.extra(mark);
            return new Tuple(CHECK(singleton_seq(this, a)), Load, ...EXTRA);
        }
        this._mark = mark;
        if ((expression = this.expression())) {
            return expression;
        }
        this._mark = mark;
        return null;
    }
    expression() {
        let a, b, c, disjunction, keyword3, keyword_1, lambdef;
        const mark = this._mark;
        if (
            (a = this.disjunction()) &&
            (keyword3 = this.keyword("if")) &&
            (b = this.disjunction()) &&
            (keyword_1 = this.keyword("else")) &&
            (c = this.expression())
        ) {
            const EXTRA = this.extra(mark);
            return new IfExp(b, a, c, ...EXTRA);
        }
        this._mark = mark;
        if ((disjunction = this.disjunction())) {
            return disjunction;
        }
        this._mark = mark;
        if ((lambdef = this.lambdef())) {
            return lambdef;
        }
        this._mark = mark;
        return null;
    }
    lambdef() {
        let a, b, keyword3, literal;
        const mark = this._mark;
        if (
            (keyword3 = this.keyword("lambda")) &&
            ((a = this.lambda_params()), 1) &&
            (literal = this.expect(11)) &&
            (b = this.expression())
        ) {
            const EXTRA = this.extra(mark);
            return new Lambda(a ? a : CHECK(empty_arguments(this)), b, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    lambda_params() {
        let invalid_lambda_parameters, lambda_parameters;
        const mark = this._mark;
        if ((invalid_lambda_parameters = this.invalid_lambda_parameters())) {
            return invalid_lambda_parameters;
        }
        this._mark = mark;
        if ((lambda_parameters = this.lambda_parameters())) {
            return lambda_parameters;
        }
        this._mark = mark;
        return null;
    }
    lambda_parameters() {
        let a, b, c, d;
        const mark = this._mark;
        if (
            (a = this.lambda_slash_no_default()) &&
            (b = this._loop0_74()) &&
            (c = this._loop0_75()) &&
            ((d = this.lambda_star_etc()), 1)
        ) {
            return make_arguments(this, a, null, b, c, d);
        }
        this._mark = mark;
        if ((a = this.lambda_slash_with_default()) && (b = this._loop0_76()) && ((c = this.lambda_star_etc()), 1)) {
            return make_arguments(this, null, a, null, b, c);
        }
        this._mark = mark;
        if ((a = this._loop1_77()) && (b = this._loop0_78()) && ((c = this.lambda_star_etc()), 1)) {
            return make_arguments(this, null, null, a, b, c);
        }
        this._mark = mark;
        if ((a = this._loop1_79()) && ((b = this.lambda_star_etc()), 1)) {
            return make_arguments(this, null, null, null, a, b);
        }
        this._mark = mark;
        if ((a = this.lambda_star_etc())) {
            return make_arguments(this, null, null, null, null, a);
        }
        this._mark = mark;
        return null;
    }
    lambda_slash_no_default() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((a = this._loop1_80()) && (literal = this.expect(17)) && (literal_1 = this.expect(12))) {
            return a;
        }
        this._mark = mark;
        if ((a = this._loop1_81()) && (literal = this.expect(17)) && this.positive_lookahead(this.expect, 11)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    lambda_slash_with_default() {
        let a, b, literal, literal_1;
        const mark = this._mark;
        if (
            (a = this._loop0_82()) &&
            (b = this._loop1_83()) &&
            (literal = this.expect(17)) &&
            (literal_1 = this.expect(12))
        ) {
            return new SlashWithDefault(a, b);
        }
        this._mark = mark;
        if (
            (a = this._loop0_84()) &&
            (b = this._loop1_85()) &&
            (literal = this.expect(17)) &&
            this.positive_lookahead(this.expect, 11)
        ) {
            return new SlashWithDefault(a, b);
        }
        this._mark = mark;
        return null;
    }
    lambda_star_etc() {
        let a, b, c, invalid_lambda_star_etc, literal, literal_1;
        const mark = this._mark;
        if (
            (literal = this.expect(16)) &&
            (a = this.lambda_param_no_default()) &&
            (b = this._loop0_86()) &&
            ((c = this.lambda_kwds()), 1)
        ) {
            return new StarEtc(a, b, c);
        }
        this._mark = mark;
        if (
            (literal = this.expect(16)) &&
            (literal_1 = this.expect(12)) &&
            (b = this._loop1_87()) &&
            ((c = this.lambda_kwds()), 1)
        ) {
            return new StarEtc(null, b, c);
        }
        this._mark = mark;
        if ((a = this.lambda_kwds())) {
            return new StarEtc(null, null, a);
        }
        this._mark = mark;
        if ((invalid_lambda_star_etc = this.invalid_lambda_star_etc())) {
            return invalid_lambda_star_etc;
        }
        this._mark = mark;
        return null;
    }
    lambda_kwds() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(35)) && (a = this.lambda_param_no_default())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    lambda_param_no_default() {
        let a, literal;
        const mark = this._mark;
        if ((a = this.lambda_param()) && (literal = this.expect(12))) {
            return a;
        }
        this._mark = mark;
        if ((a = this.lambda_param()) && this.positive_lookahead(this.expect, 11)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    lambda_param_with_default() {
        let a, c, literal;
        const mark = this._mark;
        if ((a = this.lambda_param()) && (c = this.default()) && (literal = this.expect(12))) {
            return name_default_pair(this, a, c, null);
        }
        this._mark = mark;
        if ((a = this.lambda_param()) && (c = this.default()) && this.positive_lookahead(this.expect, 11)) {
            return name_default_pair(this, a, c, null);
        }
        this._mark = mark;
        return null;
    }
    lambda_param_maybe_default() {
        let a, c, literal;
        const mark = this._mark;
        if ((a = this.lambda_param()) && ((c = this.default()), 1) && (literal = this.expect(12))) {
            return name_default_pair(this, a, c, null);
        }
        this._mark = mark;
        if ((a = this.lambda_param()) && ((c = this.default()), 1) && this.positive_lookahead(this.expect, 11)) {
            return name_default_pair(this, a, c, null);
        }
        this._mark = mark;
        return null;
    }
    lambda_param() {
        let a;
        const mark = this._mark;
        if ((a = this.name())) {
            const EXTRA = this.extra(mark);
            return new arg(a.id, null, null, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    disjunction() {
        let a, b, conjunction;
        const mark = this._mark;
        if ((a = this.conjunction()) && (b = this._loop1_88())) {
            const EXTRA = this.extra(mark);
            return new BoolOp(Or, CHECK(seq_insert_in_front(this, a, b)), ...EXTRA);
        }
        this._mark = mark;
        if ((conjunction = this.conjunction())) {
            return conjunction;
        }
        this._mark = mark;
        return null;
    }
    conjunction() {
        let a, b, inversion;
        const mark = this._mark;
        if ((a = this.inversion()) && (b = this._loop1_89())) {
            const EXTRA = this.extra(mark);
            return new BoolOp(And, CHECK(seq_insert_in_front(this, a, b)), ...EXTRA);
        }
        this._mark = mark;
        if ((inversion = this.inversion())) {
            return inversion;
        }
        this._mark = mark;
        return null;
    }
    inversion() {
        let a, comparison, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("not")) && (a = this.inversion())) {
            const EXTRA = this.extra(mark);
            return new UnaryOp(Not, a, ...EXTRA);
        }
        this._mark = mark;
        if ((comparison = this.comparison())) {
            return comparison;
        }
        this._mark = mark;
        return null;
    }
    comparison() {
        let a, b, bitwise_or;
        const mark = this._mark;
        if ((a = this.bitwise_or()) && (b = this._loop1_90())) {
            const EXTRA = this.extra(mark);
            return new Compare(a, CHECK(get_cmpops(this, b)), CHECK(get_exprs(this, b)), ...EXTRA);
        }
        this._mark = mark;
        if ((bitwise_or = this.bitwise_or())) {
            return bitwise_or;
        }
        this._mark = mark;
        return null;
    }
    compare_op_bitwise_or_pair() {
        let eq_bitwise_or,
            gt_bitwise_or,
            gte_bitwise_or,
            in_bitwise_or,
            is_bitwise_or,
            isnot_bitwise_or,
            lt_bitwise_or,
            lte_bitwise_or,
            noteq_bitwise_or,
            notin_bitwise_or;
        const mark = this._mark;
        if ((eq_bitwise_or = this.eq_bitwise_or())) {
            return eq_bitwise_or;
        }
        this._mark = mark;
        if ((noteq_bitwise_or = this.noteq_bitwise_or())) {
            return noteq_bitwise_or;
        }
        this._mark = mark;
        if ((lte_bitwise_or = this.lte_bitwise_or())) {
            return lte_bitwise_or;
        }
        this._mark = mark;
        if ((lt_bitwise_or = this.lt_bitwise_or())) {
            return lt_bitwise_or;
        }
        this._mark = mark;
        if ((gte_bitwise_or = this.gte_bitwise_or())) {
            return gte_bitwise_or;
        }
        this._mark = mark;
        if ((gt_bitwise_or = this.gt_bitwise_or())) {
            return gt_bitwise_or;
        }
        this._mark = mark;
        if ((notin_bitwise_or = this.notin_bitwise_or())) {
            return notin_bitwise_or;
        }
        this._mark = mark;
        if ((in_bitwise_or = this.in_bitwise_or())) {
            return in_bitwise_or;
        }
        this._mark = mark;
        if ((isnot_bitwise_or = this.isnot_bitwise_or())) {
            return isnot_bitwise_or;
        }
        this._mark = mark;
        if ((is_bitwise_or = this.is_bitwise_or())) {
            return is_bitwise_or;
        }
        this._mark = mark;
        return null;
    }
    eq_bitwise_or() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(27)) && (a = this.bitwise_or())) {
            return new CmpopExprPair(Eq, a);
        }
        this._mark = mark;
        return null;
    }
    noteq_bitwise_or() {
        let a, tok;
        const mark = this._mark;
        if ((tok = this.expect(28)) && (a = this.bitwise_or())) {
            return new CmpopExprPair(NotEq, a);
        }
        this._mark = mark;
        return null;
    }
    lte_bitwise_or() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(29)) && (a = this.bitwise_or())) {
            return new CmpopExprPair(LtE, a);
        }
        this._mark = mark;
        return null;
    }
    lt_bitwise_or() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(20)) && (a = this.bitwise_or())) {
            return new CmpopExprPair(Lt2, a);
        }
        this._mark = mark;
        return null;
    }
    gte_bitwise_or() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(30)) && (a = this.bitwise_or())) {
            return new CmpopExprPair(GtE, a);
        }
        this._mark = mark;
        return null;
    }
    gt_bitwise_or() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(21)) && (a = this.bitwise_or())) {
            return new CmpopExprPair(Gt, a);
        }
        this._mark = mark;
        return null;
    }
    notin_bitwise_or() {
        let a, keyword3, keyword_1;
        const mark = this._mark;
        if ((keyword3 = this.keyword("not")) && (keyword_1 = this.keyword("in")) && (a = this.bitwise_or())) {
            return new CmpopExprPair(NotIn, a);
        }
        this._mark = mark;
        return null;
    }
    in_bitwise_or() {
        let a, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("in")) && (a = this.bitwise_or())) {
            return new CmpopExprPair(In, a);
        }
        this._mark = mark;
        return null;
    }
    isnot_bitwise_or() {
        let a, keyword3, keyword_1;
        const mark = this._mark;
        if ((keyword3 = this.keyword("is")) && (keyword_1 = this.keyword("not")) && (a = this.bitwise_or())) {
            return new CmpopExprPair(IsNot, a);
        }
        this._mark = mark;
        return null;
    }
    is_bitwise_or() {
        let a, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("is")) && (a = this.bitwise_or())) {
            return new CmpopExprPair(Is, a);
        }
        this._mark = mark;
        return null;
    }
    bitwise_or() {
        let a, b, bitwise_xor, literal;
        const mark = this._mark;
        if ((a = this.bitwise_or()) && (literal = this.expect(18)) && (b = this.bitwise_xor())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, BitOr, b, ...EXTRA);
        }
        this._mark = mark;
        if ((bitwise_xor = this.bitwise_xor())) {
            return bitwise_xor;
        }
        this._mark = mark;
        return null;
    }
    bitwise_xor() {
        let a, b, bitwise_and, literal;
        const mark = this._mark;
        if ((a = this.bitwise_xor()) && (literal = this.expect(32)) && (b = this.bitwise_and())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, BitXor, b, ...EXTRA);
        }
        this._mark = mark;
        if ((bitwise_and = this.bitwise_and())) {
            return bitwise_and;
        }
        this._mark = mark;
        return null;
    }
    bitwise_and() {
        let a, b, literal, shift_expr;
        const mark = this._mark;
        if ((a = this.bitwise_and()) && (literal = this.expect(19)) && (b = this.shift_expr())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, BitAnd, b, ...EXTRA);
        }
        this._mark = mark;
        if ((shift_expr = this.shift_expr())) {
            return shift_expr;
        }
        this._mark = mark;
        return null;
    }
    shift_expr() {
        let a, b, literal, sum;
        const mark = this._mark;
        if ((a = this.shift_expr()) && (literal = this.expect(33)) && (b = this.sum())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, LShift, b, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.shift_expr()) && (literal = this.expect(34)) && (b = this.sum())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, RShift, b, ...EXTRA);
        }
        this._mark = mark;
        if ((sum = this.sum())) {
            return sum;
        }
        this._mark = mark;
        return null;
    }
    sum() {
        let a, b, literal, term;
        const mark = this._mark;
        if ((a = this.sum()) && (literal = this.expect(14)) && (b = this.term())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, Add, b, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.sum()) && (literal = this.expect(15)) && (b = this.term())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, Sub, b, ...EXTRA);
        }
        this._mark = mark;
        if ((term = this.term())) {
            return term;
        }
        this._mark = mark;
        return null;
    }
    term() {
        let a, b, factor, literal;
        const mark = this._mark;
        if ((a = this.term()) && (literal = this.expect(16)) && (b = this.factor())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, Mult, b, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.term()) && (literal = this.expect(17)) && (b = this.factor())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, Div, b, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.term()) && (literal = this.expect(47)) && (b = this.factor())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, FloorDiv, b, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.term()) && (literal = this.expect(24)) && (b = this.factor())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, Mod, b, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.term()) && (literal = this.expect(49)) && (b = this.factor())) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(5, "The '@' operator is", new BinOp(a, MatMult, b, ...EXTRA));
        }
        this._mark = mark;
        if ((factor = this.factor())) {
            return factor;
        }
        this._mark = mark;
        return null;
    }
    factor() {
        let a, literal, power;
        const mark = this._mark;
        if ((literal = this.expect(14)) && (a = this.factor())) {
            const EXTRA = this.extra(mark);
            return new UnaryOp(UAdd, a, ...EXTRA);
        }
        this._mark = mark;
        if ((literal = this.expect(15)) && (a = this.factor())) {
            const EXTRA = this.extra(mark);
            return new UnaryOp(USub, a, ...EXTRA);
        }
        this._mark = mark;
        if ((literal = this.expect(31)) && (a = this.factor())) {
            const EXTRA = this.extra(mark);
            return new UnaryOp(Invert, a, ...EXTRA);
        }
        this._mark = mark;
        if ((power = this.power())) {
            return power;
        }
        this._mark = mark;
        return null;
    }
    power() {
        let a, await_primary, b, literal;
        const mark = this._mark;
        if ((a = this.await_primary()) && (literal = this.expect(35)) && (b = this.factor())) {
            const EXTRA = this.extra(mark);
            return new BinOp(a, Pow, b, ...EXTRA);
        }
        this._mark = mark;
        if ((await_primary = this.await_primary())) {
            return await_primary;
        }
        this._mark = mark;
        return null;
    }
    await_primary() {
        let a, await_, primary;
        const mark = this._mark;
        if ((await_ = this.expect(55)) && (a = this.primary())) {
            const EXTRA = this.extra(mark);
            return CHECK_VERSION(5, "Await expressions are", new Await(a, ...EXTRA));
        }
        this._mark = mark;
        if ((primary = this.primary())) {
            return primary;
        }
        this._mark = mark;
        return null;
    }
    primary() {
        let a, atom, b, invalid_primary, literal, literal_1;
        const mark = this._mark;
        if ((invalid_primary = this.invalid_primary())) {
            return invalid_primary;
        }
        this._mark = mark;
        if ((a = this.primary()) && (literal = this.expect(23)) && (b = this.name())) {
            const EXTRA = this.extra(mark);
            return new Attribute(a, b.id, Load, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.primary()) && (b = this.genexp())) {
            const EXTRA = this.extra(mark);
            return new Call(a, CHECK(singleton_seq(this, b)), null, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.primary()) &&
            (literal = this.expect(7)) &&
            ((b = this.arguments_()), 1) &&
            (literal_1 = this.expect(8))
        ) {
            const EXTRA = this.extra(mark);
            return new Call(a, b ? b.args : null, b ? b.keywords : null, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.primary()) &&
            (literal = this.expect(9)) &&
            (b = this.slices()) &&
            (literal_1 = this.expect(10))
        ) {
            const EXTRA = this.extra(mark);
            return new Subscript(a, b, Load, ...EXTRA);
        }
        this._mark = mark;
        if ((atom = this.atom())) {
            return atom;
        }
        this._mark = mark;
        return null;
    }
    slices() {
        let a, opt;
        const mark = this._mark;
        if ((a = this.slice()) && this.negative_lookahead(this.expect, 12)) {
            return a;
        }
        this._mark = mark;
        if ((a = this._gather_91()) && ((opt = this.expect(12)), 1)) {
            const EXTRA = this.extra(mark);
            return new Tuple(a, Load, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    slice() {
        let a, b, c, literal;
        const mark = this._mark;
        if (
            ((a = this.expression()), 1) &&
            (literal = this.expect(11)) &&
            ((b = this.expression()), 1) &&
            ((c = this._tmp_93()), 1)
        ) {
            const EXTRA = this.extra(mark);
            return new Slice(a, b, c, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.expression())) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    atom() {
        let _tmp_94, _tmp_95, _tmp_96, keyword3, literal, name, number, strings;
        const mark = this._mark;
        if ((name = this.name())) {
            return name;
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("True"))) {
            const EXTRA = this.extra(mark);
            return new Constant(pyTrue, null, ...EXTRA);
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("False"))) {
            const EXTRA = this.extra(mark);
            return new Constant(pyFalse, null, ...EXTRA);
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("None"))) {
            const EXTRA = this.extra(mark);
            return new Constant(pyNone, null, ...EXTRA);
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("__peg_parser__"))) {
            return this.raise_error(pySyntaxError, "You found it!");
        }
        this._mark = mark;
        if (this.positive_lookahead(this.string) && (strings = this.strings())) {
            return strings;
        }
        this._mark = mark;
        if ((number = this.number())) {
            return number;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.expect, 7) && (_tmp_94 = this._tmp_94())) {
            return _tmp_94;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.expect, 9) && (_tmp_95 = this._tmp_95())) {
            return _tmp_95;
        }
        this._mark = mark;
        if (this.positive_lookahead(this.expect, 25) && (_tmp_96 = this._tmp_96())) {
            return _tmp_96;
        }
        this._mark = mark;
        if ((literal = this.expect(52))) {
            const EXTRA = this.extra(mark);
            return new Constant(pyEllipsis, null, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    strings() {
        let a;
        const mark = this._mark;
        if ((a = this._loop1_97())) {
            return concatenate_strings(this, a);
        }
        this._mark = mark;
        return null;
    }
    list() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((literal = this.expect(9)) && ((a = this.star_named_expressions()), 1) && (literal_1 = this.expect(10))) {
            const EXTRA = this.extra(mark);
            return new List(a, Load, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    listcomp() {
        let a, b, invalid_comprehension, literal, literal_1;
        let cut = false;
        const mark = this._mark;
        if (
            (literal = this.expect(9)) &&
            (a = this.named_expression()) &&
            (cut = true) &&
            (b = this.for_if_clauses()) &&
            (literal_1 = this.expect(10))
        ) {
            const EXTRA = this.extra(mark);
            return new ListComp(a, b, ...EXTRA);
        }
        this._mark = mark;
        if (cut) return null;
        if ((invalid_comprehension = this.invalid_comprehension())) {
            return invalid_comprehension;
        }
        this._mark = mark;
        return null;
    }
    tuple() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((literal = this.expect(7)) && ((a = this._tmp_98()), 1) && (literal_1 = this.expect(8))) {
            const EXTRA = this.extra(mark);
            return new Tuple(a, Load, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    group() {
        let a, invalid_group, literal, literal_1;
        const mark = this._mark;
        if ((literal = this.expect(7)) && (a = this._tmp_99()) && (literal_1 = this.expect(8))) {
            return a;
        }
        this._mark = mark;
        if ((invalid_group = this.invalid_group())) {
            return invalid_group;
        }
        this._mark = mark;
        return null;
    }
    genexp() {
        let a, b, invalid_comprehension, literal, literal_1;
        let cut = false;
        const mark = this._mark;
        if (
            (literal = this.expect(7)) &&
            (a = this.named_expression()) &&
            (cut = true) &&
            (b = this.for_if_clauses()) &&
            (literal_1 = this.expect(8))
        ) {
            const EXTRA = this.extra(mark);
            return new GeneratorExp(a, b, ...EXTRA);
        }
        this._mark = mark;
        if (cut) return null;
        if ((invalid_comprehension = this.invalid_comprehension())) {
            return invalid_comprehension;
        }
        this._mark = mark;
        return null;
    }
    set() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((literal = this.expect(25)) && (a = this.star_named_expressions()) && (literal_1 = this.expect(26))) {
            const EXTRA = this.extra(mark);
            return new Set2(a, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    setcomp() {
        let a, b, invalid_comprehension, literal, literal_1;
        let cut = false;
        const mark = this._mark;
        if (
            (literal = this.expect(25)) &&
            (a = this.named_expression()) &&
            (cut = true) &&
            (b = this.for_if_clauses()) &&
            (literal_1 = this.expect(26))
        ) {
            const EXTRA = this.extra(mark);
            return new SetComp(a, b, ...EXTRA);
        }
        this._mark = mark;
        if (cut) return null;
        if ((invalid_comprehension = this.invalid_comprehension())) {
            return invalid_comprehension;
        }
        this._mark = mark;
        return null;
    }
    dict() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((literal = this.expect(25)) && ((a = this.double_starred_kvpairs()), 1) && (literal_1 = this.expect(26))) {
            const EXTRA = this.extra(mark);
            return new Dict(CHECK(get_keys(this, a)), CHECK(get_values(this, a)), ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    dictcomp() {
        let a, b, invalid_dict_comprehension, literal, literal_1;
        const mark = this._mark;
        if (
            (literal = this.expect(25)) &&
            (a = this.kvpair()) &&
            (b = this.for_if_clauses()) &&
            (literal_1 = this.expect(26))
        ) {
            const EXTRA = this.extra(mark);
            return new DictComp(a.key, a.value, b, ...EXTRA);
        }
        this._mark = mark;
        if ((invalid_dict_comprehension = this.invalid_dict_comprehension())) {
            return invalid_dict_comprehension;
        }
        this._mark = mark;
        return null;
    }
    double_starred_kvpairs() {
        let a, opt;
        const mark = this._mark;
        if ((a = this._gather_100()) && ((opt = this.expect(12)), 1)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    double_starred_kvpair() {
        let a, kvpair, literal;
        const mark = this._mark;
        if ((literal = this.expect(35)) && (a = this.bitwise_or())) {
            return new KeyValuePair(null, a);
        }
        this._mark = mark;
        if ((kvpair = this.kvpair())) {
            return kvpair;
        }
        this._mark = mark;
        return null;
    }
    kvpair() {
        let a, b, literal;
        const mark = this._mark;
        if ((a = this.expression()) && (literal = this.expect(11)) && (b = this.expression())) {
            return new KeyValuePair(a, b);
        }
        this._mark = mark;
        return null;
    }
    for_if_clauses() {
        let _loop1_102;
        const mark = this._mark;
        if ((_loop1_102 = this._loop1_102())) {
            return _loop1_102;
        }
        this._mark = mark;
        return null;
    }
    for_if_clause() {
        let a, async, b, c, invalid_for_target, keyword3, keyword_1;
        let cut = false;
        const mark = this._mark;
        if (
            (async = this.expect(56)) &&
            (keyword3 = this.keyword("for")) &&
            (a = this.star_targets()) &&
            (keyword_1 = this.keyword("in")) &&
            (cut = true) &&
            (b = this.disjunction()) &&
            (c = this._loop0_103())
        ) {
            return CHECK_VERSION(6, "Async comprehensions are", new comprehension(a, b, c, 1));
        }
        this._mark = mark;
        if (cut) return null;
        if (
            (keyword3 = this.keyword("for")) &&
            (a = this.star_targets()) &&
            (keyword_1 = this.keyword("in")) &&
            (cut = true) &&
            (b = this.disjunction()) &&
            (c = this._loop0_104())
        ) {
            return new comprehension(a, b, c, 0);
        }
        this._mark = mark;
        if (cut) return null;
        if ((invalid_for_target = this.invalid_for_target())) {
            return invalid_for_target;
        }
        this._mark = mark;
        return null;
    }
    yield_expr() {
        let a, keyword3, keyword_1;
        const mark = this._mark;
        if ((keyword3 = this.keyword("yield")) && (keyword_1 = this.keyword("from")) && (a = this.expression())) {
            const EXTRA = this.extra(mark);
            return new YieldFrom(a, ...EXTRA);
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("yield")) && ((a = this.star_expressions()), 1)) {
            const EXTRA = this.extra(mark);
            return new Yield(a, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    arguments_() {
        let a, invalid_arguments, opt;
        const mark = this._mark;
        if ((a = this.args()) && ((opt = this.expect(12)), 1) && this.positive_lookahead(this.expect, 8)) {
            return a;
        }
        this._mark = mark;
        if ((invalid_arguments = this.invalid_arguments())) {
            return invalid_arguments;
        }
        this._mark = mark;
        return null;
    }
    args() {
        let a, b;
        const mark = this._mark;
        if ((a = this._gather_105()) && ((b = this._tmp_107()), 1)) {
            const EXTRA = this.extra(mark);
            return collect_call_seqs(this, a, b, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.kwargs())) {
            const EXTRA = this.extra(mark);
            return new Call(
                dummy_name(this),
                CHECK_NULL_ALLOWED(seq_extract_starred_exprs(this, a)),
                CHECK_NULL_ALLOWED(seq_delete_starred_exprs(this, a)),
                ...EXTRA
            );
        }
        this._mark = mark;
        return null;
    }
    kwargs() {
        let _gather_112, _gather_114, a, b, literal;
        const mark = this._mark;
        if ((a = this._gather_108()) && (literal = this.expect(12)) && (b = this._gather_110())) {
            return join_sequences(this, a, b);
        }
        this._mark = mark;
        if ((_gather_112 = this._gather_112())) {
            return _gather_112;
        }
        this._mark = mark;
        if ((_gather_114 = this._gather_114())) {
            return _gather_114;
        }
        this._mark = mark;
        return null;
    }
    starred_expression() {
        let a, literal;
        const mark = this._mark;
        if ((literal = this.expect(16)) && (a = this.expression())) {
            const EXTRA = this.extra(mark);
            return new Starred(a, Load, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    kwarg_or_starred() {
        let a, b, invalid_kwarg, literal;
        const mark = this._mark;
        if ((a = this.name()) && (literal = this.expect(22)) && (b = this.expression())) {
            const EXTRA = this.extra(mark);
            return new KeywordOrStarred(CHECK(new keyword(a.id, b, ...EXTRA)), true);
        }
        this._mark = mark;
        if ((a = this.starred_expression())) {
            return new KeywordOrStarred(a, false);
        }
        this._mark = mark;
        if ((invalid_kwarg = this.invalid_kwarg())) {
            return invalid_kwarg;
        }
        this._mark = mark;
        return null;
    }
    kwarg_or_double_starred() {
        let a, b, invalid_kwarg, literal;
        const mark = this._mark;
        if ((a = this.name()) && (literal = this.expect(22)) && (b = this.expression())) {
            const EXTRA = this.extra(mark);
            return new KeywordOrStarred(CHECK(new keyword(a.id, b, ...EXTRA)), true);
        }
        this._mark = mark;
        if ((literal = this.expect(35)) && (a = this.expression())) {
            const EXTRA = this.extra(mark);
            return new KeywordOrStarred(CHECK(new keyword(null, a, ...EXTRA)), true);
        }
        this._mark = mark;
        if ((invalid_kwarg = this.invalid_kwarg())) {
            return invalid_kwarg;
        }
        this._mark = mark;
        return null;
    }
    star_targets() {
        let a, b, opt;
        const mark = this._mark;
        if ((a = this.star_target()) && this.negative_lookahead(this.expect, 12)) {
            return a;
        }
        this._mark = mark;
        if ((a = this.star_target()) && (b = this._loop0_116()) && ((opt = this.expect(12)), 1)) {
            const EXTRA = this.extra(mark);
            return new Tuple(CHECK(seq_insert_in_front(this, a, b)), Store, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    star_targets_list_seq() {
        let a, opt;
        const mark = this._mark;
        if ((a = this._gather_117()) && ((opt = this.expect(12)), 1)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    star_targets_tuple_seq() {
        let a, b, literal, opt;
        const mark = this._mark;
        if ((a = this.star_target()) && (b = this._loop1_119()) && ((opt = this.expect(12)), 1)) {
            return seq_insert_in_front(this, a, b);
        }
        this._mark = mark;
        if ((a = this.star_target()) && (literal = this.expect(12))) {
            return singleton_seq(this, a);
        }
        this._mark = mark;
        return null;
    }
    star_target() {
        let a, literal, target_with_star_atom;
        const mark = this._mark;
        if ((literal = this.expect(16)) && (a = this._tmp_120())) {
            const EXTRA = this.extra(mark);
            return new Starred(CHECK(set_expr_context(this, a, Store)), Store, ...EXTRA);
        }
        this._mark = mark;
        if ((target_with_star_atom = this.target_with_star_atom())) {
            return target_with_star_atom;
        }
        this._mark = mark;
        return null;
    }
    target_with_star_atom() {
        let a, b, literal, literal_1, star_atom;
        const mark = this._mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(23)) &&
            (b = this.name()) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Attribute(a, b.id, Store, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(9)) &&
            (b = this.slices()) &&
            (literal_1 = this.expect(10)) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Subscript(a, b, Store, ...EXTRA);
        }
        this._mark = mark;
        if ((star_atom = this.star_atom())) {
            return star_atom;
        }
        this._mark = mark;
        return null;
    }
    star_atom() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((a = this.name())) {
            return set_expr_context(this, a, Store);
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && (a = this.target_with_star_atom()) && (literal_1 = this.expect(8))) {
            return set_expr_context(this, a, Store);
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && ((a = this.star_targets_tuple_seq()), 1) && (literal_1 = this.expect(8))) {
            const EXTRA = this.extra(mark);
            return new Tuple(a, Store, ...EXTRA);
        }
        this._mark = mark;
        if ((literal = this.expect(9)) && ((a = this.star_targets_list_seq()), 1) && (literal_1 = this.expect(10))) {
            const EXTRA = this.extra(mark);
            return new List(a, Store, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    single_target() {
        let a, literal, literal_1, single_subscript_attribute_target;
        const mark = this._mark;
        if ((single_subscript_attribute_target = this.single_subscript_attribute_target())) {
            return single_subscript_attribute_target;
        }
        this._mark = mark;
        if ((a = this.name())) {
            return set_expr_context(this, a, Store);
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && (a = this.single_target()) && (literal_1 = this.expect(8))) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    single_subscript_attribute_target() {
        let a, b, literal, literal_1;
        const mark = this._mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(23)) &&
            (b = this.name()) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Attribute(a, b.id, Store, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(9)) &&
            (b = this.slices()) &&
            (literal_1 = this.expect(10)) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Subscript(a, b, Store, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    del_targets() {
        let a, opt;
        const mark = this._mark;
        if ((a = this._gather_121()) && ((opt = this.expect(12)), 1)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    del_target() {
        let a, b, del_t_atom, literal, literal_1;
        const mark = this._mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(23)) &&
            (b = this.name()) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Attribute(a, b.id, Del, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(9)) &&
            (b = this.slices()) &&
            (literal_1 = this.expect(10)) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Subscript(a, b, Del, ...EXTRA);
        }
        this._mark = mark;
        if ((del_t_atom = this.del_t_atom())) {
            return del_t_atom;
        }
        this._mark = mark;
        return null;
    }
    del_t_atom() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((a = this.name())) {
            return set_expr_context(this, a, Del);
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && (a = this.del_target()) && (literal_1 = this.expect(8))) {
            return set_expr_context(this, a, Del);
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && ((a = this.del_targets()), 1) && (literal_1 = this.expect(8))) {
            const EXTRA = this.extra(mark);
            return new Tuple(a, Del, ...EXTRA);
        }
        this._mark = mark;
        if ((literal = this.expect(9)) && ((a = this.del_targets()), 1) && (literal_1 = this.expect(10))) {
            const EXTRA = this.extra(mark);
            return new List(a, Del, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    targets() {
        let a, opt;
        const mark = this._mark;
        if ((a = this._gather_123()) && ((opt = this.expect(12)), 1)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    target() {
        let a, b, literal, literal_1, t_atom;
        const mark = this._mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(23)) &&
            (b = this.name()) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Attribute(a, b.id, Store, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(9)) &&
            (b = this.slices()) &&
            (literal_1 = this.expect(10)) &&
            this.negative_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Subscript(a, b, Store, ...EXTRA);
        }
        this._mark = mark;
        if ((t_atom = this.t_atom())) {
            return t_atom;
        }
        this._mark = mark;
        return null;
    }
    t_primary() {
        let a, b, literal, literal_1;
        const mark = this._mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(23)) &&
            (b = this.name()) &&
            this.positive_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Attribute(a, b.id, Load, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(9)) &&
            (b = this.slices()) &&
            (literal_1 = this.expect(10)) &&
            this.positive_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Subscript(a, b, Load, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.t_primary()) && (b = this.genexp()) && this.positive_lookahead(this.t_lookahead)) {
            const EXTRA = this.extra(mark);
            return new Call(a, CHECK(singleton_seq(this, b)), null, ...EXTRA);
        }
        this._mark = mark;
        if (
            (a = this.t_primary()) &&
            (literal = this.expect(7)) &&
            ((b = this.arguments_()), 1) &&
            (literal_1 = this.expect(8)) &&
            this.positive_lookahead(this.t_lookahead)
        ) {
            const EXTRA = this.extra(mark);
            return new Call(a, b ? b.args : null, b ? b.keywords : null, ...EXTRA);
        }
        this._mark = mark;
        if ((a = this.atom()) && this.positive_lookahead(this.t_lookahead)) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    t_lookahead() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(7))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(9))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(23))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
    t_atom() {
        let a, b, literal, literal_1;
        const mark = this._mark;
        if ((a = this.name())) {
            return set_expr_context(this, a, Store);
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && (a = this.target()) && (literal_1 = this.expect(8))) {
            return set_expr_context(this, a, Store);
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && ((b = this.targets()), 1) && (literal_1 = this.expect(8))) {
            const EXTRA = this.extra(mark);
            return new Tuple(b, Store, ...EXTRA);
        }
        this._mark = mark;
        if ((literal = this.expect(9)) && ((b = this.targets()), 1) && (literal_1 = this.expect(10))) {
            const EXTRA = this.extra(mark);
            return new List(b, Store, ...EXTRA);
        }
        this._mark = mark;
        return null;
    }
    invalid_arguments() {
        let a, args, for_if_clauses, literal, literal_1, opt;
        const mark = this._mark;
        if ((args = this.args()) && (literal = this.expect(12)) && (literal_1 = this.expect(16))) {
            return this.raise_error(pySyntaxError, "iterable argument unpacking follows keyword argument unpacking");
        }
        this._mark = mark;
        if (
            (a = this.expression()) &&
            (for_if_clauses = this.for_if_clauses()) &&
            (literal = this.expect(12)) &&
            ((opt = this._tmp_125()), 1)
        ) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "Generator expression must be parenthesized"
            );
        }
        this._mark = mark;
        if ((a = this.args()) && (for_if_clauses = this.for_if_clauses())) {
            return nonparen_genexp_in_call(this, a);
        }
        this._mark = mark;
        if (
            (args = this.args()) &&
            (literal = this.expect(12)) &&
            (a = this.expression()) &&
            (for_if_clauses = this.for_if_clauses())
        ) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "Generator expression must be parenthesized"
            );
        }
        this._mark = mark;
        if ((a = this.args()) && (literal = this.expect(12)) && (args = this.args())) {
            return arguments_parsing_error(this, a);
        }
        this._mark = mark;
        return null;
    }
    invalid_kwarg() {
        let a, literal;
        const mark = this._mark;
        if ((a = this.expression()) && (literal = this.expect(22))) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                'expression cannot contain assignment, perhaps you meant "=="?'
            );
        }
        this._mark = mark;
        return null;
    }
    invalid_named_expression() {
        let a, expression, literal;
        const mark = this._mark;
        if ((a = this.expression()) && (literal = this.expect(53)) && (expression = this.expression())) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "cannot use assignment expressions with %s",
                get_expr_name(a)
            );
        }
        this._mark = mark;
        return null;
    }
    invalid_assignment() {
        let _loop0_126, _loop0_127, _loop0_128, _tmp_129, a, augassign, expression, literal, literal_1;
        const mark = this._mark;
        if (
            (a = this.invalid_ann_assign_target()) &&
            (literal = this.expect(11)) &&
            (expression = this.expression())
        ) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "only single target (not %s) can be annotated",
                get_expr_name(a)
            );
        }
        this._mark = mark;
        if (
            (a = this.star_named_expression()) &&
            (literal = this.expect(12)) &&
            (_loop0_126 = this._loop0_126()) &&
            (literal_1 = this.expect(11)) &&
            (expression = this.expression())
        ) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "only single target (not tuple) can be annotated"
            );
        }
        this._mark = mark;
        if ((a = this.expression()) && (literal = this.expect(11)) && (expression = this.expression())) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "illegal target for annotation"
            );
        }
        this._mark = mark;
        if ((_loop0_127 = this._loop0_127()) && (a = this.star_expressions()) && (literal = this.expect(22))) {
            return this.raise_error_invalid_target(STAR_TARGETS, a);
        }
        this._mark = mark;
        if ((_loop0_128 = this._loop0_128()) && (a = this.yield_expr()) && (literal = this.expect(22))) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "assignment to yield expression not possible"
            );
        }
        this._mark = mark;
        if ((a = this.star_expressions()) && (augassign = this.augassign()) && (_tmp_129 = this._tmp_129())) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "'%s' is an illegal expression for augmented assignment",
                get_expr_name(a)
            );
        }
        this._mark = mark;
        return null;
    }
    invalid_ann_assign_target() {
        let a, list, literal, literal_1, tuple;
        const mark = this._mark;
        if ((list = this.list())) {
            return list;
        }
        this._mark = mark;
        if ((tuple = this.tuple())) {
            return tuple;
        }
        this._mark = mark;
        if ((literal = this.expect(7)) && (a = this.invalid_ann_assign_target()) && (literal_1 = this.expect(8))) {
            return a;
        }
        this._mark = mark;
        return null;
    }
    invalid_del_stmt() {
        let a, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("del")) && (a = this.star_expressions())) {
            return this.raise_error_invalid_target(DEL_TARGETS, a);
        }
        this._mark = mark;
        return null;
    }
    invalid_block() {
        let newline;
        const mark = this._mark;
        if ((newline = this.expect(4)) && this.negative_lookahead(this.expect, 5)) {
            return this.raise_error(pyIndentationError, "expected an indented block");
        }
        this._mark = mark;
        return null;
    }
    invalid_primary() {
        let a, primary;
        const mark = this._mark;
        if ((primary = this.primary()) && (a = this.expect(25))) {
            return this.raise_error_known_location(pySyntaxError, a.lineno, a.col_offset + 1, "invalid syntax");
        }
        this._mark = mark;
        return null;
    }
    invalid_comprehension() {
        let _tmp_130, a, for_if_clauses;
        const mark = this._mark;
        if (
            (_tmp_130 = this._tmp_130()) &&
            (a = this.starred_expression()) &&
            (for_if_clauses = this.for_if_clauses())
        ) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "iterable unpacking cannot be used in comprehension"
            );
        }
        this._mark = mark;
        return null;
    }
    invalid_dict_comprehension() {
        let a, bitwise_or, for_if_clauses, literal, literal_1;
        const mark = this._mark;
        if (
            (literal = this.expect(25)) &&
            (a = this.expect(35)) &&
            (bitwise_or = this.bitwise_or()) &&
            (for_if_clauses = this.for_if_clauses()) &&
            (literal_1 = this.expect(26))
        ) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "dict unpacking cannot be used in dict comprehension"
            );
        }
        this._mark = mark;
        return null;
    }
    invalid_parameters() {
        let _loop0_131, _tmp_132, param_no_default;
        const mark = this._mark;
        if (
            (_loop0_131 = this._loop0_131()) &&
            (_tmp_132 = this._tmp_132()) &&
            (param_no_default = this.param_no_default())
        ) {
            return this.raise_error(pySyntaxError, "non-default argument follows default argument");
        }
        this._mark = mark;
        return null;
    }
    invalid_lambda_parameters() {
        let _loop0_133, _tmp_134, lambda_param_no_default;
        const mark = this._mark;
        if (
            (_loop0_133 = this._loop0_133()) &&
            (_tmp_134 = this._tmp_134()) &&
            (lambda_param_no_default = this.lambda_param_no_default())
        ) {
            return this.raise_error(pySyntaxError, "non-default argument follows default argument");
        }
        this._mark = mark;
        return null;
    }
    invalid_star_etc() {
        let _tmp_135, literal, literal_1, type_comment;
        const mark = this._mark;
        if ((literal = this.expect(16)) && (_tmp_135 = this._tmp_135())) {
            return this.raise_error(pySyntaxError, "named arguments must follow bare *");
        }
        this._mark = mark;
        if ((literal = this.expect(16)) && (literal_1 = this.expect(12)) && (type_comment = this.expect(58))) {
            return this.raise_error(pySyntaxError, "bare * has associated type comment");
        }
        this._mark = mark;
        return null;
    }
    invalid_lambda_star_etc() {
        let _tmp_136, literal;
        const mark = this._mark;
        if ((literal = this.expect(16)) && (_tmp_136 = this._tmp_136())) {
            return this.raise_error(pySyntaxError, "named arguments must follow bare *");
        }
        this._mark = mark;
        return null;
    }
    invalid_double_type_comments() {
        let indent, newline, newline_1, type_comment, type_comment_1;
        const mark = this._mark;
        if (
            (type_comment = this.expect(58)) &&
            (newline = this.expect(4)) &&
            (type_comment_1 = this.expect(58)) &&
            (newline_1 = this.expect(4)) &&
            (indent = this.expect(5))
        ) {
            return this.raise_error(pySyntaxError, "Cannot have two type comments on def");
        }
        this._mark = mark;
        return null;
    }
    invalid_with_item() {
        let a, expression, keyword3;
        const mark = this._mark;
        if ((expression = this.expression()) && (keyword3 = this.keyword("as")) && (a = this.expression())) {
            return this.raise_error_invalid_target(STAR_TARGETS, a);
        }
        this._mark = mark;
        return null;
    }
    invalid_for_target() {
        let a, keyword3, opt;
        const mark = this._mark;
        if (((opt = this.expect(56)), 1) && (keyword3 = this.keyword("for")) && (a = this.star_expressions())) {
            return this.raise_error_invalid_target(FOR_TARGETS, a);
        }
        this._mark = mark;
        return null;
    }
    invalid_group() {
        let a, literal, literal_1;
        const mark = this._mark;
        if ((literal = this.expect(7)) && (a = this.starred_expression()) && (literal_1 = this.expect(8))) {
            return this.raise_error_known_location(
                pySyntaxError,
                a.lineno,
                a.col_offset + 1,
                "can't use starred expression here"
            );
        }
        this._mark = mark;
        return null;
    }
    invalid_import_from_targets() {
        let import_from_as_names, literal;
        const mark = this._mark;
        if ((import_from_as_names = this.import_from_as_names()) && (literal = this.expect(12))) {
            return this.raise_error(pySyntaxError, "trailing comma not allowed without surrounding parentheses");
        }
        this._mark = mark;
        return null;
    }
    _loop0_1() {
        let newline;
        const children = [];
        let mark = this._mark;
        while ((newline = this.expect(4))) {
            children.push(newline);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_2() {
        let newline;
        const children = [];
        let mark = this._mark;
        while ((newline = this.expect(4))) {
            children.push(newline);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_4() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.expression())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_3() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.expression()) !== null && (seq = this._loop0_4()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_6() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.expression())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_5() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.expression()) !== null && (seq = this._loop0_6()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_8() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.expression())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_7() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.expression()) !== null && (seq = this._loop0_8()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_10() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.expression())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_9() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.expression()) !== null && (seq = this._loop0_10()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop1_11() {
        let statement;
        const children = [];
        let mark = this._mark;
        while ((statement = this.statement())) {
            children.push(statement);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_13() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(13)) && (elem = this.small_stmt())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_12() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.small_stmt()) !== null && (seq = this._loop0_13()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_14() {
        let keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("import"))) {
            return keyword3;
        }
        this._mark = mark;
        if ((keyword3 = this.keyword("from"))) {
            return keyword3;
        }
        this._mark = mark;
        return null;
    }
    _tmp_15() {
        let async, keyword3, literal;
        const mark = this._mark;
        if ((keyword3 = this.keyword("def"))) {
            return keyword3;
        }
        this._mark = mark;
        if ((literal = this.expect(49))) {
            return literal;
        }
        this._mark = mark;
        if ((async = this.expect(56))) {
            return async;
        }
        this._mark = mark;
        return null;
    }
    _tmp_16() {
        let keyword3, literal;
        const mark = this._mark;
        if ((keyword3 = this.keyword("class"))) {
            return keyword3;
        }
        this._mark = mark;
        if ((literal = this.expect(49))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
    _tmp_17() {
        let async, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("with"))) {
            return keyword3;
        }
        this._mark = mark;
        if ((async = this.expect(56))) {
            return async;
        }
        this._mark = mark;
        return null;
    }
    _tmp_18() {
        let async, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("for"))) {
            return keyword3;
        }
        this._mark = mark;
        if ((async = this.expect(56))) {
            return async;
        }
        this._mark = mark;
        return null;
    }
    _tmp_19() {
        let d, literal;
        const mark = this._mark;
        if ((literal = this.expect(22)) && (d = this.annotated_rhs())) {
            return d;
        }
        this._mark = mark;
        return null;
    }
    _tmp_20() {
        let b, literal, literal_1, single_subscript_attribute_target;
        const mark = this._mark;
        if ((literal = this.expect(7)) && (b = this.single_target()) && (literal_1 = this.expect(8))) {
            return b;
        }
        this._mark = mark;
        if ((single_subscript_attribute_target = this.single_subscript_attribute_target())) {
            return single_subscript_attribute_target;
        }
        this._mark = mark;
        return null;
    }
    _tmp_21() {
        let d, literal;
        const mark = this._mark;
        if ((literal = this.expect(22)) && (d = this.annotated_rhs())) {
            return d;
        }
        this._mark = mark;
        return null;
    }
    _loop1_22() {
        let _tmp_137;
        const children = [];
        let mark = this._mark;
        while ((_tmp_137 = this._tmp_137())) {
            children.push(_tmp_137);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _tmp_23() {
        let star_expressions, yield_expr;
        const mark = this._mark;
        if ((yield_expr = this.yield_expr())) {
            return yield_expr;
        }
        this._mark = mark;
        if ((star_expressions = this.star_expressions())) {
            return star_expressions;
        }
        this._mark = mark;
        return null;
    }
    _tmp_24() {
        let star_expressions, yield_expr;
        const mark = this._mark;
        if ((yield_expr = this.yield_expr())) {
            return yield_expr;
        }
        this._mark = mark;
        if ((star_expressions = this.star_expressions())) {
            return star_expressions;
        }
        this._mark = mark;
        return null;
    }
    _loop0_26() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.name())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_25() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.name()) !== null && (seq = this._loop0_26()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_28() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.name())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_27() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.name()) !== null && (seq = this._loop0_28()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_29() {
        let literal, z;
        const mark = this._mark;
        if ((literal = this.expect(12)) && (z = this.expression())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_30() {
        let literal, newline;
        const mark = this._mark;
        if ((literal = this.expect(13))) {
            return literal;
        }
        this._mark = mark;
        if ((newline = this.expect(4))) {
            return newline;
        }
        this._mark = mark;
        return null;
    }
    _loop0_31() {
        let _tmp_138;
        const children = [];
        let mark = this._mark;
        while ((_tmp_138 = this._tmp_138())) {
            children.push(_tmp_138);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_32() {
        let _tmp_139;
        const children = [];
        let mark = this._mark;
        while ((_tmp_139 = this._tmp_139())) {
            children.push(_tmp_139);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_34() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.import_from_as_name())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_33() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.import_from_as_name()) !== null && (seq = this._loop0_34()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_35() {
        let keyword3, z;
        const mark = this._mark;
        if ((keyword3 = this.keyword("as")) && (z = this.name())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _loop0_37() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.dotted_as_name())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_36() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.dotted_as_name()) !== null && (seq = this._loop0_37()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_38() {
        let keyword3, z;
        const mark = this._mark;
        if ((keyword3 = this.keyword("as")) && (z = this.name())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _loop0_40() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.with_item())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_39() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.with_item()) !== null && (seq = this._loop0_40()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_42() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.with_item())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_41() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.with_item()) !== null && (seq = this._loop0_42()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_44() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.with_item())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_43() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.with_item()) !== null && (seq = this._loop0_44()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_46() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.with_item())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_45() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.with_item()) !== null && (seq = this._loop0_46()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_47() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(12))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(8))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(11))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
    _loop1_48() {
        let except_block;
        const children = [];
        let mark = this._mark;
        while ((except_block = this.except_block())) {
            children.push(except_block);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _tmp_49() {
        let keyword3, z;
        const mark = this._mark;
        if ((keyword3 = this.keyword("as")) && (z = this.name())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_50() {
        let keyword3, z;
        const mark = this._mark;
        if ((keyword3 = this.keyword("from")) && (z = this.expression())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_51() {
        let literal, z;
        const mark = this._mark;
        if ((literal = this.expect(51)) && (z = this.expression())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_52() {
        let literal, z;
        const mark = this._mark;
        if ((literal = this.expect(51)) && (z = this.expression())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_53() {
        let indent, newline;
        const mark = this._mark;
        if ((newline = this.expect(4)) && (indent = this.expect(5))) {
            return [newline, indent];
        }
        this._mark = mark;
        return null;
    }
    _loop0_54() {
        let param_no_default;
        const children = [];
        let mark = this._mark;
        while ((param_no_default = this.param_no_default())) {
            children.push(param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_55() {
        let param_with_default;
        const children = [];
        let mark = this._mark;
        while ((param_with_default = this.param_with_default())) {
            children.push(param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_56() {
        let param_with_default;
        const children = [];
        let mark = this._mark;
        while ((param_with_default = this.param_with_default())) {
            children.push(param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_57() {
        let param_no_default;
        const children = [];
        let mark = this._mark;
        while ((param_no_default = this.param_no_default())) {
            children.push(param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_58() {
        let param_with_default;
        const children = [];
        let mark = this._mark;
        while ((param_with_default = this.param_with_default())) {
            children.push(param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_59() {
        let param_with_default;
        const children = [];
        let mark = this._mark;
        while ((param_with_default = this.param_with_default())) {
            children.push(param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_60() {
        let param_no_default;
        const children = [];
        let mark = this._mark;
        while ((param_no_default = this.param_no_default())) {
            children.push(param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_61() {
        let param_no_default;
        const children = [];
        let mark = this._mark;
        while ((param_no_default = this.param_no_default())) {
            children.push(param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_62() {
        let param_no_default;
        const children = [];
        let mark = this._mark;
        while ((param_no_default = this.param_no_default())) {
            children.push(param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_63() {
        let param_with_default;
        const children = [];
        let mark = this._mark;
        while ((param_with_default = this.param_with_default())) {
            children.push(param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_64() {
        let param_no_default;
        const children = [];
        let mark = this._mark;
        while ((param_no_default = this.param_no_default())) {
            children.push(param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_65() {
        let param_with_default;
        const children = [];
        let mark = this._mark;
        while ((param_with_default = this.param_with_default())) {
            children.push(param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_66() {
        let param_maybe_default;
        const children = [];
        let mark = this._mark;
        while ((param_maybe_default = this.param_maybe_default())) {
            children.push(param_maybe_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_67() {
        let param_maybe_default;
        const children = [];
        let mark = this._mark;
        while ((param_maybe_default = this.param_maybe_default())) {
            children.push(param_maybe_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_68() {
        let _tmp_140;
        const children = [];
        let mark = this._mark;
        while ((_tmp_140 = this._tmp_140())) {
            children.push(_tmp_140);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _tmp_69() {
        let literal, literal_1, z;
        const mark = this._mark;
        if ((literal = this.expect(7)) && ((z = this.arguments_()), 1) && (literal_1 = this.expect(8))) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _loop1_70() {
        let _tmp_141;
        const children = [];
        let mark = this._mark;
        while ((_tmp_141 = this._tmp_141())) {
            children.push(_tmp_141);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_72() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.star_named_expression())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_71() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.star_named_expression()) !== null && (seq = this._loop0_72()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop1_73() {
        let _tmp_142;
        const children = [];
        let mark = this._mark;
        while ((_tmp_142 = this._tmp_142())) {
            children.push(_tmp_142);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_74() {
        let lambda_param_no_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_no_default = this.lambda_param_no_default())) {
            children.push(lambda_param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_75() {
        let lambda_param_with_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_with_default = this.lambda_param_with_default())) {
            children.push(lambda_param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_76() {
        let lambda_param_with_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_with_default = this.lambda_param_with_default())) {
            children.push(lambda_param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_77() {
        let lambda_param_no_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_no_default = this.lambda_param_no_default())) {
            children.push(lambda_param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_78() {
        let lambda_param_with_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_with_default = this.lambda_param_with_default())) {
            children.push(lambda_param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_79() {
        let lambda_param_with_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_with_default = this.lambda_param_with_default())) {
            children.push(lambda_param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_80() {
        let lambda_param_no_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_no_default = this.lambda_param_no_default())) {
            children.push(lambda_param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_81() {
        let lambda_param_no_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_no_default = this.lambda_param_no_default())) {
            children.push(lambda_param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_82() {
        let lambda_param_no_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_no_default = this.lambda_param_no_default())) {
            children.push(lambda_param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_83() {
        let lambda_param_with_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_with_default = this.lambda_param_with_default())) {
            children.push(lambda_param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_84() {
        let lambda_param_no_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_no_default = this.lambda_param_no_default())) {
            children.push(lambda_param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_85() {
        let lambda_param_with_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_with_default = this.lambda_param_with_default())) {
            children.push(lambda_param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_86() {
        let lambda_param_maybe_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_maybe_default = this.lambda_param_maybe_default())) {
            children.push(lambda_param_maybe_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop1_87() {
        let lambda_param_maybe_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_maybe_default = this.lambda_param_maybe_default())) {
            children.push(lambda_param_maybe_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_88() {
        let _tmp_143;
        const children = [];
        let mark = this._mark;
        while ((_tmp_143 = this._tmp_143())) {
            children.push(_tmp_143);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_89() {
        let _tmp_144;
        const children = [];
        let mark = this._mark;
        while ((_tmp_144 = this._tmp_144())) {
            children.push(_tmp_144);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_90() {
        let compare_op_bitwise_or_pair;
        const children = [];
        let mark = this._mark;
        while ((compare_op_bitwise_or_pair = this.compare_op_bitwise_or_pair())) {
            children.push(compare_op_bitwise_or_pair);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_92() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.slice())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_91() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.slice()) !== null && (seq = this._loop0_92()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_93() {
        let d, literal;
        const mark = this._mark;
        if ((literal = this.expect(11)) && ((d = this.expression()), 1)) {
            return d;
        }
        this._mark = mark;
        return null;
    }
    _tmp_94() {
        let genexp, group2, tuple;
        const mark = this._mark;
        if ((tuple = this.tuple())) {
            return tuple;
        }
        this._mark = mark;
        if ((group2 = this.group())) {
            return group2;
        }
        this._mark = mark;
        if ((genexp = this.genexp())) {
            return genexp;
        }
        this._mark = mark;
        return null;
    }
    _tmp_95() {
        let list, listcomp;
        const mark = this._mark;
        if ((list = this.list())) {
            return list;
        }
        this._mark = mark;
        if ((listcomp = this.listcomp())) {
            return listcomp;
        }
        this._mark = mark;
        return null;
    }
    _tmp_96() {
        let dict, dictcomp, set, setcomp;
        const mark = this._mark;
        if ((dict = this.dict())) {
            return dict;
        }
        this._mark = mark;
        if ((set = this.set())) {
            return set;
        }
        this._mark = mark;
        if ((dictcomp = this.dictcomp())) {
            return dictcomp;
        }
        this._mark = mark;
        if ((setcomp = this.setcomp())) {
            return setcomp;
        }
        this._mark = mark;
        return null;
    }
    _loop1_97() {
        let string;
        const children = [];
        let mark = this._mark;
        while ((string = this.string())) {
            children.push(string);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _tmp_98() {
        let literal, y, z;
        const mark = this._mark;
        if (
            (y = this.star_named_expression()) &&
            (literal = this.expect(12)) &&
            ((z = this.star_named_expressions()), 1)
        ) {
            return seq_insert_in_front(this, y, z);
        }
        this._mark = mark;
        return null;
    }
    _tmp_99() {
        let named_expression, yield_expr;
        const mark = this._mark;
        if ((yield_expr = this.yield_expr())) {
            return yield_expr;
        }
        this._mark = mark;
        if ((named_expression = this.named_expression())) {
            return named_expression;
        }
        this._mark = mark;
        return null;
    }
    _loop0_101() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.double_starred_kvpair())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_100() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.double_starred_kvpair()) !== null && (seq = this._loop0_101()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop1_102() {
        let for_if_clause;
        const children = [];
        let mark = this._mark;
        while ((for_if_clause = this.for_if_clause())) {
            children.push(for_if_clause);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop0_103() {
        let _tmp_145;
        const children = [];
        let mark = this._mark;
        while ((_tmp_145 = this._tmp_145())) {
            children.push(_tmp_145);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_104() {
        let _tmp_146;
        const children = [];
        let mark = this._mark;
        while ((_tmp_146 = this._tmp_146())) {
            children.push(_tmp_146);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_106() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this._tmp_147())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_105() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this._tmp_147()) !== null && (seq = this._loop0_106()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_107() {
        let k, literal;
        const mark = this._mark;
        if ((literal = this.expect(12)) && (k = this.kwargs())) {
            return k;
        }
        this._mark = mark;
        return null;
    }
    _loop0_109() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.kwarg_or_starred())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_108() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.kwarg_or_starred()) !== null && (seq = this._loop0_109()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_111() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.kwarg_or_double_starred())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_110() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.kwarg_or_double_starred()) !== null && (seq = this._loop0_111()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_113() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.kwarg_or_starred())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_112() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.kwarg_or_starred()) !== null && (seq = this._loop0_113()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_115() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.kwarg_or_double_starred())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_114() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.kwarg_or_double_starred()) !== null && (seq = this._loop0_115()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_116() {
        let _tmp_148;
        const children = [];
        let mark = this._mark;
        while ((_tmp_148 = this._tmp_148())) {
            children.push(_tmp_148);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_118() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.star_target())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_117() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.star_target()) !== null && (seq = this._loop0_118()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop1_119() {
        let _tmp_149;
        const children = [];
        let mark = this._mark;
        while ((_tmp_149 = this._tmp_149())) {
            children.push(_tmp_149);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _tmp_120() {
        let star_target;
        const mark = this._mark;
        if (this.negative_lookahead(this.expect, 16) && (star_target = this.star_target())) {
            return star_target;
        }
        this._mark = mark;
        return null;
    }
    _loop0_122() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.del_target())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_121() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.del_target()) !== null && (seq = this._loop0_122()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _loop0_124() {
        let elem, literal;
        const children = [];
        let mark = this._mark;
        while ((literal = this.expect(12)) && (elem = this.target())) {
            children.push(elem);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _gather_123() {
        let elem, seq;
        const mark = this._mark;
        if ((elem = this.target()) !== null && (seq = this._loop0_124()) !== null) {
            return [elem, ...seq];
        }
        this._mark = mark;
        return null;
    }
    _tmp_125() {
        let args, expression, for_if_clauses;
        const mark = this._mark;
        if ((args = this.args())) {
            return args;
        }
        this._mark = mark;
        if ((expression = this.expression()) && (for_if_clauses = this.for_if_clauses())) {
            return [expression, for_if_clauses];
        }
        this._mark = mark;
        return null;
    }
    _loop0_126() {
        let star_named_expressions;
        const children = [];
        let mark = this._mark;
        while ((star_named_expressions = this.star_named_expressions())) {
            children.push(star_named_expressions);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_127() {
        let _tmp_150;
        const children = [];
        let mark = this._mark;
        while ((_tmp_150 = this._tmp_150())) {
            children.push(_tmp_150);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _loop0_128() {
        let _tmp_151;
        const children = [];
        let mark = this._mark;
        while ((_tmp_151 = this._tmp_151())) {
            children.push(_tmp_151);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _tmp_129() {
        let star_expressions, yield_expr;
        const mark = this._mark;
        if ((yield_expr = this.yield_expr())) {
            return yield_expr;
        }
        this._mark = mark;
        if ((star_expressions = this.star_expressions())) {
            return star_expressions;
        }
        this._mark = mark;
        return null;
    }
    _tmp_130() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(9))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(7))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(25))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
    _loop0_131() {
        let param_no_default;
        const children = [];
        let mark = this._mark;
        while ((param_no_default = this.param_no_default())) {
            children.push(param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _tmp_132() {
        let _loop1_152, slash_with_default;
        const mark = this._mark;
        if ((slash_with_default = this.slash_with_default())) {
            return slash_with_default;
        }
        this._mark = mark;
        if ((_loop1_152 = this._loop1_152())) {
            return _loop1_152;
        }
        this._mark = mark;
        return null;
    }
    _loop0_133() {
        let lambda_param_no_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_no_default = this.lambda_param_no_default())) {
            children.push(lambda_param_no_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children;
    }
    _tmp_134() {
        let _loop1_153, lambda_slash_with_default;
        const mark = this._mark;
        if ((lambda_slash_with_default = this.lambda_slash_with_default())) {
            return lambda_slash_with_default;
        }
        this._mark = mark;
        if ((_loop1_153 = this._loop1_153())) {
            return _loop1_153;
        }
        this._mark = mark;
        return null;
    }
    _tmp_135() {
        let _tmp_154, literal;
        const mark = this._mark;
        if ((literal = this.expect(8))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(12)) && (_tmp_154 = this._tmp_154())) {
            return [literal, _tmp_154];
        }
        this._mark = mark;
        return null;
    }
    _tmp_136() {
        let _tmp_155, literal;
        const mark = this._mark;
        if ((literal = this.expect(11))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(12)) && (_tmp_155 = this._tmp_155())) {
            return [literal, _tmp_155];
        }
        this._mark = mark;
        return null;
    }
    _tmp_137() {
        let literal, z;
        const mark = this._mark;
        if ((z = this.star_targets()) && (literal = this.expect(22))) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_138() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(23))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(52))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
    _tmp_139() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(23))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(52))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
    _tmp_140() {
        let f, literal, newline;
        const mark = this._mark;
        if ((literal = this.expect(49)) && (f = this.named_expression()) && (newline = this.expect(4))) {
            return f;
        }
        this._mark = mark;
        return null;
    }
    _tmp_141() {
        let c, literal;
        const mark = this._mark;
        if ((literal = this.expect(12)) && (c = this.star_expression())) {
            return c;
        }
        this._mark = mark;
        return null;
    }
    _tmp_142() {
        let c, literal;
        const mark = this._mark;
        if ((literal = this.expect(12)) && (c = this.expression())) {
            return c;
        }
        this._mark = mark;
        return null;
    }
    _tmp_143() {
        let c, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("or")) && (c = this.conjunction())) {
            return c;
        }
        this._mark = mark;
        return null;
    }
    _tmp_144() {
        let c, keyword3;
        const mark = this._mark;
        if ((keyword3 = this.keyword("and")) && (c = this.inversion())) {
            return c;
        }
        this._mark = mark;
        return null;
    }
    _tmp_145() {
        let keyword3, z;
        const mark = this._mark;
        if ((keyword3 = this.keyword("if")) && (z = this.disjunction())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_146() {
        let keyword3, z;
        const mark = this._mark;
        if ((keyword3 = this.keyword("if")) && (z = this.disjunction())) {
            return z;
        }
        this._mark = mark;
        return null;
    }
    _tmp_147() {
        let named_expression, starred_expression;
        const mark = this._mark;
        if ((starred_expression = this.starred_expression())) {
            return starred_expression;
        }
        this._mark = mark;
        if ((named_expression = this.named_expression()) && this.negative_lookahead(this.expect, 22)) {
            return named_expression;
        }
        this._mark = mark;
        return null;
    }
    _tmp_148() {
        let c, literal;
        const mark = this._mark;
        if ((literal = this.expect(12)) && (c = this.star_target())) {
            return c;
        }
        this._mark = mark;
        return null;
    }
    _tmp_149() {
        let c, literal;
        const mark = this._mark;
        if ((literal = this.expect(12)) && (c = this.star_target())) {
            return c;
        }
        this._mark = mark;
        return null;
    }
    _tmp_150() {
        let literal, star_targets;
        const mark = this._mark;
        if ((star_targets = this.star_targets()) && (literal = this.expect(22))) {
            return [star_targets, literal];
        }
        this._mark = mark;
        return null;
    }
    _tmp_151() {
        let literal, star_targets;
        const mark = this._mark;
        if ((star_targets = this.star_targets()) && (literal = this.expect(22))) {
            return [star_targets, literal];
        }
        this._mark = mark;
        return null;
    }
    _loop1_152() {
        let param_with_default;
        const children = [];
        let mark = this._mark;
        while ((param_with_default = this.param_with_default())) {
            children.push(param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _loop1_153() {
        let lambda_param_with_default;
        const children = [];
        let mark = this._mark;
        while ((lambda_param_with_default = this.lambda_param_with_default())) {
            children.push(lambda_param_with_default);
            mark = this._mark;
        }
        this._mark = mark;
        return children.length ? children : null;
    }
    _tmp_154() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(8))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(35))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
    _tmp_155() {
        let literal;
        const mark = this._mark;
        if ((literal = this.expect(11))) {
            return literal;
        }
        this._mark = mark;
        if ((literal = this.expect(35))) {
            return literal;
        }
        this._mark = mark;
        return null;
    }
};
__decorateClass([memoize], GeneratedParser.prototype, "file", 1);
__decorateClass([memoize], GeneratedParser.prototype, "interactive", 1);
__decorateClass([memoize], GeneratedParser.prototype, "eval", 1);
__decorateClass([memoize], GeneratedParser.prototype, "func_type", 1);
__decorateClass([memoize], GeneratedParser.prototype, "fstring", 1);
__decorateClass([memoize], GeneratedParser.prototype, "type_expressions", 1);
__decorateClass([memoize], GeneratedParser.prototype, "statements", 1);
__decorateClass([memoize], GeneratedParser.prototype, "statement", 1);
__decorateClass([memoize], GeneratedParser.prototype, "statement_newline", 1);
__decorateClass([memoize], GeneratedParser.prototype, "simple_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "small_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "compound_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "assignment", 1);
__decorateClass([memoize], GeneratedParser.prototype, "augassign", 1);
__decorateClass([memoize], GeneratedParser.prototype, "global_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "nonlocal_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "yield_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "assert_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "del_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "import_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "import_name", 1);
__decorateClass([memoize], GeneratedParser.prototype, "import_from", 1);
__decorateClass([memoize], GeneratedParser.prototype, "import_from_targets", 1);
__decorateClass([memoize], GeneratedParser.prototype, "import_from_as_names", 1);
__decorateClass([memoize], GeneratedParser.prototype, "import_from_as_name", 1);
__decorateClass([memoize], GeneratedParser.prototype, "dotted_as_names", 1);
__decorateClass([memoize], GeneratedParser.prototype, "dotted_as_name", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "dotted_name", 1);
__decorateClass([memoize], GeneratedParser.prototype, "if_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "elif_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "else_block", 1);
__decorateClass([memoize], GeneratedParser.prototype, "while_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "for_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "with_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "with_item", 1);
__decorateClass([memoize], GeneratedParser.prototype, "try_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "except_block", 1);
__decorateClass([memoize], GeneratedParser.prototype, "finally_block", 1);
__decorateClass([memoize], GeneratedParser.prototype, "return_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "raise_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "function_def", 1);
__decorateClass([memoize], GeneratedParser.prototype, "function_def_raw", 1);
__decorateClass([memoize], GeneratedParser.prototype, "func_type_comment", 1);
__decorateClass([memoize], GeneratedParser.prototype, "params", 1);
__decorateClass([memoize], GeneratedParser.prototype, "parameters", 1);
__decorateClass([memoize], GeneratedParser.prototype, "slash_no_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "slash_with_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_etc", 1);
__decorateClass([memoize], GeneratedParser.prototype, "kwds", 1);
__decorateClass([memoize], GeneratedParser.prototype, "param_no_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "param_with_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "param_maybe_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "param", 1);
__decorateClass([memoize], GeneratedParser.prototype, "annotation", 1);
__decorateClass([memoize], GeneratedParser.prototype, "default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "decorators", 1);
__decorateClass([memoize], GeneratedParser.prototype, "class_def", 1);
__decorateClass([memoize], GeneratedParser.prototype, "class_def_raw", 1);
__decorateClass([memoize], GeneratedParser.prototype, "block", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_expressions", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_expression", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_named_expressions", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_named_expression", 1);
__decorateClass([memoize], GeneratedParser.prototype, "named_expression", 1);
__decorateClass([memoize], GeneratedParser.prototype, "annotated_rhs", 1);
__decorateClass([memoize], GeneratedParser.prototype, "expressions", 1);
__decorateClass([memoize], GeneratedParser.prototype, "expression", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambdef", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_params", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_parameters", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_slash_no_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_slash_with_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_star_etc", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_kwds", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_param_no_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_param_with_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_param_maybe_default", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lambda_param", 1);
__decorateClass([memoize], GeneratedParser.prototype, "disjunction", 1);
__decorateClass([memoize], GeneratedParser.prototype, "conjunction", 1);
__decorateClass([memoize], GeneratedParser.prototype, "inversion", 1);
__decorateClass([memoize], GeneratedParser.prototype, "comparison", 1);
__decorateClass([memoize], GeneratedParser.prototype, "compare_op_bitwise_or_pair", 1);
__decorateClass([memoize], GeneratedParser.prototype, "eq_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "noteq_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lte_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "lt_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "gte_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "gt_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "notin_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "in_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "isnot_bitwise_or", 1);
__decorateClass([memoize], GeneratedParser.prototype, "is_bitwise_or", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "bitwise_or", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "bitwise_xor", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "bitwise_and", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "shift_expr", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "sum", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "term", 1);
__decorateClass([memoize], GeneratedParser.prototype, "factor", 1);
__decorateClass([memoize], GeneratedParser.prototype, "power", 1);
__decorateClass([memoize], GeneratedParser.prototype, "await_primary", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "primary", 1);
__decorateClass([memoize], GeneratedParser.prototype, "slices", 1);
__decorateClass([memoize], GeneratedParser.prototype, "slice", 1);
__decorateClass([memoize], GeneratedParser.prototype, "atom", 1);
__decorateClass([memoize], GeneratedParser.prototype, "strings", 1);
__decorateClass([memoize], GeneratedParser.prototype, "list", 1);
__decorateClass([memoize], GeneratedParser.prototype, "listcomp", 1);
__decorateClass([memoize], GeneratedParser.prototype, "tuple", 1);
__decorateClass([memoize], GeneratedParser.prototype, "group", 1);
__decorateClass([memoize], GeneratedParser.prototype, "genexp", 1);
__decorateClass([memoize], GeneratedParser.prototype, "set", 1);
__decorateClass([memoize], GeneratedParser.prototype, "setcomp", 1);
__decorateClass([memoize], GeneratedParser.prototype, "dict", 1);
__decorateClass([memoize], GeneratedParser.prototype, "dictcomp", 1);
__decorateClass([memoize], GeneratedParser.prototype, "double_starred_kvpairs", 1);
__decorateClass([memoize], GeneratedParser.prototype, "double_starred_kvpair", 1);
__decorateClass([memoize], GeneratedParser.prototype, "kvpair", 1);
__decorateClass([memoize], GeneratedParser.prototype, "for_if_clauses", 1);
__decorateClass([memoize], GeneratedParser.prototype, "for_if_clause", 1);
__decorateClass([memoize], GeneratedParser.prototype, "yield_expr", 1);
__decorateClass([memoize], GeneratedParser.prototype, "arguments_", 1);
__decorateClass([memoize], GeneratedParser.prototype, "args", 1);
__decorateClass([memoize], GeneratedParser.prototype, "kwargs", 1);
__decorateClass([memoize], GeneratedParser.prototype, "starred_expression", 1);
__decorateClass([memoize], GeneratedParser.prototype, "kwarg_or_starred", 1);
__decorateClass([memoize], GeneratedParser.prototype, "kwarg_or_double_starred", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_targets", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_targets_list_seq", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_targets_tuple_seq", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_target", 1);
__decorateClass([memoize], GeneratedParser.prototype, "target_with_star_atom", 1);
__decorateClass([memoize], GeneratedParser.prototype, "star_atom", 1);
__decorateClass([memoize], GeneratedParser.prototype, "single_target", 1);
__decorateClass([memoize], GeneratedParser.prototype, "single_subscript_attribute_target", 1);
__decorateClass([memoize], GeneratedParser.prototype, "del_targets", 1);
__decorateClass([memoize], GeneratedParser.prototype, "del_target", 1);
__decorateClass([memoize], GeneratedParser.prototype, "del_t_atom", 1);
__decorateClass([memoize], GeneratedParser.prototype, "targets", 1);
__decorateClass([memoize], GeneratedParser.prototype, "target", 1);
__decorateClass([memoizeLeftRec], GeneratedParser.prototype, "t_primary", 1);
__decorateClass([memoize], GeneratedParser.prototype, "t_lookahead", 1);
__decorateClass([memoize], GeneratedParser.prototype, "t_atom", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_arguments", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_kwarg", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_named_expression", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_assignment", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_ann_assign_target", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_del_stmt", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_block", 1);
__decorateClass([logger], GeneratedParser.prototype, "invalid_primary", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_comprehension", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_dict_comprehension", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_parameters", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_lambda_parameters", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_star_etc", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_lambda_star_etc", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_double_type_comments", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_with_item", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_for_target", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_group", 1);
__decorateClass([memoize], GeneratedParser.prototype, "invalid_import_from_targets", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_1", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_2", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_4", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_3", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_6", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_5", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_8", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_7", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_10", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_9", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_11", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_13", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_12", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_22", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_26", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_25", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_28", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_27", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_31", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_32", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_34", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_33", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_37", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_36", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_40", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_39", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_42", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_41", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_44", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_43", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_46", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_45", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_48", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_54", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_55", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_56", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_57", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_58", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_59", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_60", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_61", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_62", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_63", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_64", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_65", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_66", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_67", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_68", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_70", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_72", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_71", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_73", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_74", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_75", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_76", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_77", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_78", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_79", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_80", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_81", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_82", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_83", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_84", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_85", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_86", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_87", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_88", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_89", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_90", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_92", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_91", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_97", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_101", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_100", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_102", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_103", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_104", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_106", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_105", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_109", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_108", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_111", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_110", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_113", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_112", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_115", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_114", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_116", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_118", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_117", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_119", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_122", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_121", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_124", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_gather_123", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_126", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_127", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_128", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_131", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop0_133", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_152", 1);
__decorateClass([memoize], GeneratedParser.prototype, "_loop1_153", 1);
var KEYWORDS = new Set([
    "return",
    "raise",
    "pass",
    "del",
    "yield",
    "assert",
    "break",
    "continue",
    "global",
    "nonlocal",
    "if",
    "try",
    "while",
    "import",
    "from",
    "elif",
    "else",
    "for",
    "in",
    "with",
    "as",
    "except",
    "finally",
    "def",
    "class",
    "lambda",
    "not",
    "is",
    "True",
    "False",
    "None",
    "__peg_parser__",
    "or",
    "and",
]);

// src/parser/parse.ts
function modeStrToStartRule(mode) {
    switch (mode) {
        case "exec":
            return StartRule.FILE_INPUT;
        case "eval":
            return StartRule.EVAL_INPUT;
        case "single":
            return StartRule.SINGLE_INPUT;
        default:
            throw new Error(`bad mode - got ${mode} - use 'exec', 'eval' or 'single'`);
    }
}
function parserFromString(text, mode = "exec", filename = "<string>") {
    const parser = new GeneratedParser(tokenizerFromString(text, filename), modeStrToStartRule(mode));
    parser.filename = filename;
    return parser;
}
function runParserFromString(text, mode = "exec", filename = "<string>") {
    return parserFromString(text, mode, filename).parse();
}
export { Tokenizer, parserFromString, runParserFromString, tokenize };
