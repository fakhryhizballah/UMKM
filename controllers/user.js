const jwt = require("jsonwebtoken");
const { Province, Regency, District, Village, Entity, Location, Product, User, sequelize } = require("../models");
const { getGeoid } = require("../helper/location");
const { Op, where } = require("sequelize");
const { admin } = require(".");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
};
module.exports = {
    addEntity: async (req, res) => {
        let body = req.body;
        console.log(body);
        console.log(body.prov);
        // let path = req.file;
        const logousaha = req.files["logousaha"] ? req.files["logousaha"][0] : null;
        // Multiple files
        const fotoproduk = req.files["fotoproduk"] || [];

        let t = await sequelize.transaction();
        try {
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
                }, { transaction: t })
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
                }, { transaction: t })
            }
            let kec = await District.count({
                where: {
                    idDistrict: body.kec
                }
            }, { transaction: t })
            if (kec == 0) {
                let dataKec = await getGeoid('district', body.kec);
                await District.create({
                    idDistrict: body.kec,
                    name: dataKec.name,
                    regencyId: body.kota
                }, { transaction: t })
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
                }, { transaction: t })
            }
            let token = req.cookies.token;
            let decoded = jwt.verify(token, secretKey);

            let entity = await Entity.create({
                username: decoded.username,
                badanusaha: body.badanusaha,
                npwp: body.npwp,
                nib: body.nib,
                omzet: body.omzet,
                kategoriusaha: body.kategoriusaha,
                levelusaha: body.levelusaha,
                logousaha: '/asset/cdn/' + logousaha.filename,
                deskripsiusaha: body.deskripsiusaha,
                deskripsiproduk: body.deskripsiproduk,
                status: "pending"
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
    },
    cekUsername: async (req, res) => {
        let username = req.body.username;
        console.log(username);
        let data = await User.count({
            where: {
                username: username
            }
        })
        if (data == 0) {
            return res.status(200).json({
                error: false,
                message: "Username tersedia!",
                data: {
                    available: true
                }
            });
        } else {
            return res.status(200).json({
                error: true,
                message: "Username sudah digunakan!",
                data: {
                    available: false
                }
            });
        }
    },
    userRegister: async (req, res) => {
        let body = req.body;
        console.log(body);

        try {
            let user = await User.create({
                username: body.username,
                email: body.email,
                nowa: body.nowa,
                password: body.password,
                fullName: body.fullName,
                role: 'user'
            })
            return res.status(200).json({
                error: false,
                message: "User berhasil didaftarkan!",
                data: user
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }

    },
    findMaps: async (req, res) => {
        let data = await Location.findAll({
            where: {
                status: "accepted"
            },
            attributes: ['lat', 'lng'],
            include: [{
                model: Entity,
                as: 'entity',
                attributes: ['id', 'badanusaha', 'logousaha', 'kategoriusaha']
            }]
        })
        return res.status(200).json({
            error: false,
            message: "Data Maps",
            data: data
        });
    }
}
