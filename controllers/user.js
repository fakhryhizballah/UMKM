const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Entity, Location, Product, sequelize } = require("../models");
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
