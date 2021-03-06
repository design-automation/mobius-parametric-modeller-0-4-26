import { GIModel } from './GIModel';
import { TColor, TNormal, TTexture, EAttribNames, Txyz, EEntType} from './common';
/**
 * Export to obj
 */
export function exportObj(model: GIModel): string {
    const h_str = '# File generated by Mobius.\n';
    // the order of data is 1) vertex, 2) texture, 3) normal
    let v_str = '';
    let vt_str = '';
    let vn_str = '';
    let f_str = '';
    let l_str = '';
    // do we have color, texture, normal?
    const has_color_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.COLOUR);
    const has_normal_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.NORMAL);
    const has_texture_attrib: boolean = model.attribs.query.hasAttrib(EEntType.VERT, EAttribNames.TEXTURE);
    const posis_i: number[] = model.geom.query.getEnts(EEntType.POSI, false);
    const verts_i: number[] = model.geom.query.getEnts(EEntType.VERT, false);
    // positions
    if (has_color_attrib) {
        for (const vert_i of verts_i) {
            const color: TColor = model.attribs.query.getAttribValue(EEntType.VERT, EAttribNames.COLOUR, vert_i) as TColor;
            const coord: Txyz = model.attribs.query.getVertCoords(vert_i);
            v_str += 'v ' + coord.map( v => v.toString() ).join(' ') + color.map( c => c.toString() ).join(' ') + '\n';
        }
    } else {
        for (const posi_i of posis_i) {
            const coord: Txyz = model.attribs.query.getPosiCoords(posi_i);
            v_str += 'v ' + coord.map( v => v.toString() ).join(' ') + '\n';
        }
    }
    // textures, vt
    if (has_texture_attrib) {
        for (const vert_i of verts_i) {
            const texture: TTexture = model.attribs.query.getAttribValue(EEntType.VERT, EAttribNames.TEXTURE, vert_i) as TTexture;
            vt_str += 'v ' + texture.map( v => v.toString() ).join(' ') + '\n';
        }
    }
    // normals, vn
    if (has_normal_attrib) {
        for (const vert_i of verts_i) {
            const normal: TNormal = model.attribs.query.getAttribValue(EEntType.VERT, EAttribNames.NORMAL, vert_i) as TNormal;
            vn_str += 'v ' + normal.map( v => v.toString() ).join(' ') + '\n';
        }
    }
    // polygons, f
    const pgons_i: number[] = model.geom.query.getEnts(EEntType.PGON, false);
    for (const pgon_i of pgons_i) {
        const pgon_verts_i_outer: number[] = model.geom.query.navAnyToVert(EEntType.PGON, pgon_i);
        // const verts_i_outer = verts_i[0];
        // TODO what about holes
        if (has_texture_attrib) {
            // TODO
        }
        if (has_normal_attrib) {
            // TODO
        }
        if (has_color_attrib) {
            f_str += 'f ' + pgon_verts_i_outer.map( vert_i => (vert_i + 1).toString() ).join(' ') + '\n';
        } else {
            f_str += 'f ' + pgon_verts_i_outer.map( vert_i => (model.geom.query.navVertToPosi(vert_i) + 1).toString() ).join(' ') + '\n';
        }
    }
    // polylines, l
    const plines_i: number[] = model.geom.query.getEnts(EEntType.PLINE, false);
    for (const pline_i of plines_i) {
        const pline_verts_i: number[] = model.geom.query.navAnyToVert(EEntType.PLINE, pline_i);
        l_str += 'l ' + pline_verts_i.map( vert_i => (vert_i + 1).toString() ).join(' ') + '\n';
    }
    // result
    return h_str + v_str + v_str + vt_str + vn_str + f_str + l_str;
}
