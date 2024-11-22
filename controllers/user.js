const jwt = require("jsonwebtoken");
const { Province, Regency, District, Village, Entity, Location, Product, sequelize } = require("../models");
const { getGeoid } = require("../helper/location");
const { Op } = require("sequelize");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
};
module.exports = {
    register: async (req, res) => {
        let body = req.body;
        console.log(body);
        console.log(body.prov);
        // let path = req.file;
        const logousaha = req.files["logousaha"] ? req.files["logousaha"][0] : null;

        // Multiple files
        const fotoproduk = req.files["fotoproduk"] || [];
        console.log(logousaha);
        console.log(fotoproduk);
        let prov = await Province.count({
            where: {
                idProvince: body.prov
            }
        })
        if (prov == 0) {
            let dataProv = await getGeoid('province', body.prov);
            console.log(dataProv);
            await Province.create({
                idProvince: body.prov,
                name: dataProv.name
            })
        }
        let regen = await Regency.count({
            where: {
                idRegency: body.kota
            }
        })
        if (regen == 0) {
            let dataRegen = await getGeoid('regency', body.kota);
            await Regency.create({
                idRegency: body.kota,
                name: dataRegen.name,
                provinceId: body.prov
            })
        }
        let kec = await District.count({
            where: {
                idDistrict: body.kec
            }
        })
        if (kec == 0) {
            let dataKec = await getGeoid('district', body.kec);
            await District.create({
                idDistrict: body.kec,
                name: dataKec.name,
                regencyId: body.kota
            })
        }
        let kel = await Village.count({
            where: {
                idVillage: body.kel
            }
        })
        if (kel == 0) {
            let dataKel = await getGeoid('village', body.kel);
            await Village.create({
                idVillage: body.kel,
                name: dataKel.name,
                districtId: body.kec
            })
        }
        let t = await sequelize.transaction();
        try {
            let entity = await Entity.create({
                username: body.username,
                name: body.name,
                nowa: body.nowa,
                email: body.email,
                badanusaha: body.badanusaha,
                npwp: body.npwp,
                nib: body.nib,
                omzet: body.omzet,
                kategoriusaha: body.kategoriusaha,
                levelusaha: body.levelusaha,
                logousaha: '/asset/cdn/' + logousaha.filename,
                deskripsiusaha: body.deskripsiusaha,
                deskripsiproduk: body.deskripsiproduk,
            }, { transaction: t });
            let location = await Location.create({
                entityId: entity.id,
                lat: body.lat,
                lng: body.lng,
                address: body.alamat,
                province: body.prov,
                regency: body.kota,
                district: body.kec,
                village: body.kel,
                status: "pending",
            }, { transaction: t });
            for (let x of fotoproduk) {
                await Product.create({
                    entityId: entity.id,
                    url: '/asset/cdn/' + x.filename,
                }, { transaction: t });
            }
            await t.commit();
            return res.status(200).json({
                error: false,
                message: "UKM berhasil didaftarkan!",
                // data: data
            });
        } catch (err) {
            console.log(err);
            await t.rollback();
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    }
}
