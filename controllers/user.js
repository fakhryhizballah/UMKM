const jwt = require("jsonwebtoken");
const { Province, Regency, District, Village, Entity, Location, Product, User, Entity_Status, Profile, file, Proposal, RiwayatProposal, sequelize } = require("../models");
const { getGeoid } = require("../helper/location");
const { Op, or } = require("sequelize");
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
                logousaha: '/asset/cdn/' + logousaha.filename,
                deskripsiusaha: body.deskripsiusaha,
                deskripsiproduk: body.deskripsiproduk,
                status: "pending"
            }, { transaction: t });
            await Entity_Status.create({
                entityId: entity.id,
                message: "Menunggu konfirmasi admin",
                status: "pending"
            }, { transaction: t });
            await Location.create({
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
                nik: body.nik,
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
        let data = await Entity.findAll({
            where: {
                status: "accepted"
            },
            attributes: ['id', 'badanusaha', 'logousaha', 'kategoriusaha'],
            include: [{
                model: Location,
                // as: 'location',
                attributes: ['lat', 'lng']
            }]
        })
        return res.status(200).json({
            error: false,
            message: "Data Maps",
            data: data
        });
    },
    getAllEntity: async (req, res) => {
        try {
            let token = req.cookies.token;
            let decoded = jwt.verify(token, secretKey);
            let data = await Entity.findAll({
                where: {
                    username: decoded.username
                }
            })
            return res.status(200).json({
                error: false,
                message: "Data Entity",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    showStatus: async (req, res) => {
        try {
            let id = req.params.id;

            let data = await Entity_Status.findAll({
                where: {
                    entityId: id
                }
            })
            return res.status(200).json({
                error: false,
                message: "Data Status",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    getProfile: async (req, res) => {
        try {
            let profil = await Profile.findOne({
                where: {
                    username: req.account.username
                },
                attributes: { exclude: ['id', 'url_pp', 'createdAt', 'updatedAt'] }
            })
            let user = await User.findOne({
                where: {
                    username: req.account.username
                }
            });
            console.log(user);
            console.log(profil);
            let data = {
                nik: user.nik,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                nowa: user.nowa,
                alamat: '',
                modal: '',
            }
            if (profil != null) {
                Object.assign(data, profil.dataValues);
            }

            return res.status(200).json({
                error: false,
                message: "Data Profile",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    updateProfile: async (req, res) => {
        try {
            let body = req.body;
            let user = await User.findOne({
                where: {
                    username: req.account.username
                }
            })
            if (body.NIK) {
                body.nik = body.NIK;
                await user.update(body)
            }
            if (body.nama) {
                body.fullName = body.nama;
                delete body.nama;
                await user.update(body)
            }
            if (body.NoWa) {
                body.nowa = body.NoWa;
                await user.update(body)
            }
            if (body.email) {
                await user.update(body)
            }
            let profil = await Profile.findOne({
                where: {
                    username: req.account.username
                }
            })
            if (body.modal) {
                if (profil == null) {
                    await Profile.create({
                        username: req.account.username,
                        modal: body.modal
                    })
                } else {
                    await profil.update({
                        modal: body.modal
                    })
                }
            }
            if (body.tahun_berdiri) {
                if (profil == null) {
                    await Profile.create({
                        username: req.account.username,
                        tahun_berdiri: parseInt(body.tahun_berdiri)
                    })
                } else {
                    await profil.update({
                        tahun_berdiri: parseInt(body.tahun_berdiri)
                    })
                }
            }
            if (body.betuk_usaha) {
                if (profil == null) {
                    await Profile.create({
                        username: req.account.username,
                        betuk_usaha: body.betuk_usaha
                    })
                } else {
                    await profil.update({
                        betuk_usaha: body.betuk_usaha
                    })
                }
            }
            if (body.ukuran_pasar) {
                if (profil == null) {
                    await Profile.create({
                        username: req.account.username,
                        ukuran_pasar: body.ukuran_pasar
                    })
                } else {
                    await profil.update({
                        ukuran_pasar: body.ukuran_pasar
                    })
                }
            }

            return res.status(200).json({
                error: false,
                message: "Data Profile",
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
    updateAlamat: async (req, res) => {
        try {
            let body = req.body;
            let profil = await Profile.findOne({
                where: {
                    username: req.account.username
                }
            })
            if (profil == null) {
                Object.assign(body, { username: req.account.username });
                await Profile.create(body)
            } else {
                await profil.update(body)
            }
            return res.status(200).json({
                error: false,
                message: "Data Profile",
                data: profil
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    postPicture: async (req, res) => {
        try {
            let body = req;
            let path = req.file.path;
            // console.log(body);
            console.log(path);
            path = path.split("public/cache/")[1];
            body.url_pp = '/asset/cdn/' + path;
            console.log(req.account)
            let data = await Profile.findOne({
                where: {
                    username: req.account.username
                }
            })
            if (!data) {
                data = await Profile.create({
                    username: req.account.username,
                    url_pp: body.url_pp
                })
            } else {
                await data.update({
                    url_pp: body.url_pp
                })
            }

            return res.status(200).json({
                error: false,
                message: "Data Profile",
                // data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },

    // updateProfile: async (req, res) => {
    //     try {
    //         let body = req.body;

    //         let data = await Profile.findOne({
    //             where: {
    //                 username: req.account.username
    //             }
    //         })
    //         if (!data) {
    //             data = await Profile.create({
    //                 username: req.account.username,
    //                 alamat: body.alamat,
    //                 modal: body.modal
    //             })
    //         } else {
    //             await data.update({
    //                 alamat: body.alamat,
    //                 modal: body.modal
    //             })
    //         }
    //         return res.status(200).json({
    //             error: false,
    //             message: "Data Status",
    //             data: berkas
    //         });
    //     } catch (err) {
    //         console.log(err);
    //         return res.status(400).json({
    //             error: true,
    //             message: "something went wrong!",
    //         });
    //     }
    // },
    berkas: async (req, res) => {
        try {
            let body = req.body;

            let berkas = await file.findAll({
                where: {
                    username: req.account.username
                }
            })
            return res.status(200).json({
                error: false,
                message: "Data Status",
                data: berkas
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    postBerkas: async (req, res) => {
        try {
            let body = req.body;
            let path = req.file.path;
            path = path.split("public/cache/")[1];
            body.username = req.account.username

            let berkas = await file.create({
                username: body.username,
                jenis_files: body.jenis_files,
                nomor: body.nomor,
                url_data: '/asset/cdn/' + path,
                status: '0'
            })
            return res.status(200).json({
                error: false,
                message: "Data Status",
                data: body
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                message: "something went wrong!",
            });
        }
    },
    delBerkas: async (req, res) => {
        try {
            let body = req.body;

            let berkas = await file.destroy({
                where: {
                    username: req.account.username,
                    id: body.id
                }
            })
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data Status",
                data: berkas
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    },
    addProposal: async (req, res) => {
        let t = await sequelize.transaction();
        try {
            let body = req.body;
            body.username = req.account.username
            let data = await Proposal.create(body, { transaction: t })
            await RiwayatProposal.create({
                proposal_id: data.id,
                status: 'Pengajuan',
                catatan: '-',
                tanggal: new Date()

            }, { transaction: t })
            await t.commit();
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data Status",
                data: data
            });
        } catch (err) {
            await t.rollback();
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    },
    getProposal: async (req, res) => {
        try {
            let data = await Proposal.findOne({
                where: {
                    username: req.account.username,
                    id: req.params.id
                },
            }
            )
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data Status",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    },
    updateProposal: async (req, res) => {
        let t = await sequelize.transaction();
        try {
            let body = req.body;
            let data = await Proposal.update(body, {
                where: {
                    username: req.account.username,
                    id: req.params.id
                }
            }, { transaction: t })
            await RiwayatProposal.create({
                proposal_id: req.params.id,
                status: 'Proposal Diperbaharui',
                catatan: '-',
                tanggal: new Date()

            }, { transaction: t })
            await t.commit();
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data Status",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    },
    getListProposal: async (req, res) => {
        try {
            let data = await Proposal.findAll({
                where: {
                    username: req.account.username
                },
                attributes: { exclude: ['username', 'latar_belakang', 'isi_proposal', 'jenis_bantuan'] },
                include: [{
                    model: RiwayatProposal,
                    as: 'riwayat_proposal',
                    order: [['tanggal', 'DESC']],
                    attributes: ['status', 'catatan', 'tanggal'],
                    limit: 1
                }]
            })
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data Status",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    },
    getStatusProposal: async (req, res) => {
        try {
            let data = await RiwayatProposal.findAll({
                where: {
                    id: req.params.id
                },
            })
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data Status",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    },
    upload: async (req, res) => {
        try {
            let path = req.file.path;
            path = path.split("public/cache/")[1];
            return res.status(200).json({
                error: false,
                status: 200,
                message: "Data Status",
                url: '/asset/cdn/' + path
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: true,
                status: 400,
                message: "something went wrong!",
            });
        }
    }

}
